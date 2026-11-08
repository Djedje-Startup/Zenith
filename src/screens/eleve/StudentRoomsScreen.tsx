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
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────────────────────────────
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const JOURS_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const ROOM_TYPES = ['Toutes', 'Salle de classe', 'Laboratoire', 'Amphithéâtre', 'Espace de travail', 'Salle de réunion'];

const generateReservationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RES-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
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

const MOCK_RESERVATIONS: MyReservation[] = [
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
];

// ──────────────────────────────────────────────────────────────
// MODAL DE RÉSERVATION
// ──────────────────────────────────────────────────────────────
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
  const { colors } = useTheme();
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 20,
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
          maxHeight: '90%',
        }}>
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }} />

          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
          }}>
            Réserver {room.nom}
          </Text>
          <Text style={{
            fontSize: 13,
            color: colors.textMuted,
            marginBottom: 20,
          }}>
            {room.type} • Capacité: {room.capacite} personnes
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.textMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                Date (JJ/MM/AAAA)
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
                placeholder="Ex: 25/12/2025"
                placeholderTextColor={colors.textMuted}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textMuted,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Heure début
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
                  placeholder="Ex: 14:00"
                  placeholderTextColor={colors.textMuted}
                  value={heureDebut}
                  onChangeText={setHeureDebut}
                />
              </View>

              <View style={{ flex: 1, marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textMuted,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Heure fin
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
                  placeholder="Ex: 16:00"
                  placeholderTextColor={colors.textMuted}
                  value={heureFin}
                  onChangeText={setHeureFin}
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.textMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                Motif de la réservation
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
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="Décrivez l'utilisation prévue..."
                placeholderTextColor={colors.textMuted}
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
                  backgroundColor: colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.textMuted,
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
                  backgroundColor: isLoading ? colors.textMuted : colors.primary,
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

// ──────────────────────────────────────────────────────────────
// SCREEN PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentRoomsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'disponibles' | 'mesReservations'>('disponibles');
  const [myReservations, setMyReservations] = useState(MOCK_RESERVATIONS);

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

  // ─── Rendu des disponibilités ───
  const renderDisponibilites = (room: Room) => {
    if (!room.disponibilites) return null;
    
    const joursDispo = JOURS.filter(jour => room.disponibilites?.[jour as keyof typeof room.disponibilites]);
    
    if (joursDispo.length === 0) return null;

    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{
          fontSize: 10,
          fontWeight: '700',
          color: colors.textMuted,
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
                backgroundColor: colors.surfaceElevated,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <Text style={{
                  fontSize: 9,
                  color: colors.textSecondary,
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

  // ─── Configuration du statut ───
  const getStatutConfig = (statut: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: keyof typeof Feather.glyphMap }> = {
      confirmee: { label: 'Confirmée', color: colors.success, bg: colors.success + '15', icon: 'check-circle' },
      en_attente: { label: 'En attente', color: colors.warning, bg: colors.warning + '15', icon: 'clock' },
      annulee: { label: 'Annulée', color: colors.error, bg: colors.error + '15', icon: 'x-circle' },
    };
    return configs[statut] || { label: statut, color: colors.textMuted, bg: colors.surfaceElevated, icon: 'circle' };
  };

  // ─── Rendu d'une carte de salle (sans le composant Card) ───
  const renderRoomCard = ({ item }: { item: Room }) => (
    <View style={{ marginBottom: 12 }}>
      {/* ✅ CARTE CLAIRE - remplacement du composant Card */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
            }}>
              {item.nom}
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.textSecondary,
              marginTop: 2,
            }}>
              {item.type}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
            }}>
              <Feather name="users" size={14} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                Capacité: {item.capacite} personnes
              </Text>
            </View>
          </View>
          <View style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor: item.disponible ? colors.success + '15' : colors.error + '15',
          }}>
            <Text style={{
              fontSize: 10,
              fontWeight: '700',
              color: item.disponible ? colors.success : colors.error,
            }}>
              {item.disponible ? 'Disponible' : 'Occupée'}
            </Text>
          </View>
        </View>

        {item.description && (
          <Text style={{
            fontSize: 13,
            color: colors.textSecondary,
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
                  backgroundColor: colors.primaryBg,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                }}>
                  <Text style={{ fontSize: 10, color: colors.primary }}>
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
          borderTopColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="tag" size={14} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {item.prix || 'Gratuit'}
            </Text>
          </View>
        </View>

        {item.disponible ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleReserve(item)}
            style={{
              marginTop: 12,
              backgroundColor: colors.primary,
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
        ) : (
          <View style={{
            marginTop: 12,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{
              fontSize: 13,
              color: colors.textMuted,
            }}>
              Salle actuellement occupée
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // ─── Rendu d'une carte de réservation (sans le composant Card) ───
  const renderReservationCard = ({ item }: { item: MyReservation }) => {
    const statutConfig = getStatutConfig(item.statut);
    return (
      <View style={{ marginBottom: 12 }}>
        {/* ✅ CARTE CLAIRE - remplacement du composant Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        }}>
          {/* Code de réservation */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <View style={{
              backgroundColor: colors.primaryBg,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: colors.primary,
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
            color: colors.text,
          }}>
            {item.roomName}
          </Text>
          <Text style={{
            fontSize: 13,
            color: colors.textSecondary,
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
            borderTopColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="calendar" size={14} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="clock" size={14} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                {item.heureDebut} - {item.heureFin}
              </Text>
            </View>
          </View>

          <Text style={{
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 8,
            fontStyle: 'italic',
          }}>
            {item.motif}
          </Text>

          <Text style={{
            fontSize: 10,
            color: colors.textMuted,
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
                backgroundColor: colors.error + '15',
                borderWidth: 1,
                borderColor: colors.error + '30',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.error,
              }}>
                Annuler la réservation
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ─── RENDU ───
  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
              backgroundColor: 'rgba(255,255,255,0.2)',
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

          {/* ─── TAB SWITCHER ─── */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.12)',
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
                backgroundColor: activeTab === 'disponibles' ? 'rgba(255,255,255,0.2)' : 'transparent',
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
                backgroundColor: activeTab === 'mesReservations' ? 'rgba(255,255,255,0.2)' : 'transparent',
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
          // ─── VUE DES SALLES DISPONIBLES ───
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
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 14,
                marginBottom: 12,
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
                  placeholder="Rechercher une salle..."
                  placeholderTextColor={colors.textMuted}
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
                      backgroundColor: selectedType === type ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: selectedType === type ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: selectedType === type ? '700' : '600',
                      color: selectedType === type ? '#FFFFFF' : colors.textSecondary,
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
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              }
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              renderItem={renderRoomCard}
              ListEmptyComponent={
                <View style={{
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
                    <Feather name="map-pin" size={36} color={colors.primary} />
                  </View>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: colors.text,
                  }}>
                    Aucune salle trouvée
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    Aucune salle ne correspond à vos critères
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          // ─── VUE MES RÉSERVATIONS ───
          <FlatList
            data={myReservations}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={renderReservationCard}
            ListEmptyComponent={
              <View style={{
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
                  <Feather name="calendar" size={36} color={colors.primary} />
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.text,
                }}>
                  Aucune réservation
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Vous n'avez pas encore de réservation de salle
                </Text>
              </View>
            }
          />
        )}

        {/* ─── MODAL DE RÉSERVATION ─── */}
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