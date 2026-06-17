// src/components/shared/MessagingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Avatar } from '../../components/ui/Avatar';
import { useAppStore } from '../../store';

// ─── Design Tokens ────────────────────────────────────────────────────────────
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
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
  white: '#FFFFFF',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  expediteurId: string;
  expediteurNom: string;
  message: string;
  date: string;
  lu: boolean;
  isMine: boolean;
  luPar?: string[];
}

interface Conversation {
  id: string;
  nom: string;
  prenoms?: string;
  avatar?: string;
  dernierMessage: string;
  date: string;
  nonLus: number;
  online?: boolean;
  type: 'eleve' | 'parent' | 'professeur' | 'groupe';
  membres?: string[];
  messages?: Message[];
  estGroupe?: boolean;
}

interface MessagingScreenProps {
  type: 'student' | 'parent' | 'teacher';
  onBack?: () => void;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS: Record<string, Conversation[]> = {
  student: [
    { 
      id: '1', 
      nom: 'Ma Classe - 3ème A', 
      prenoms: '', 
      dernierMessage: 'Bonjour, le cours de maths est annulé', 
      date: '10:30', 
      nonLus: 3, 
      type: 'groupe',
      estGroupe: true,
      membres: ['M. NGOMA', 'Mme LOUBAKI', 'Jean', 'Marie', 'Paul', 'Claire'],
      messages: [
        { id: 'm1', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Bonjour à tous, le cours de maths est annulé', date: '10:25', lu: true, isMine: false, luPar: ['Jean', 'Marie'] },
        { id: 'm2', expediteurId: '2', expediteurNom: 'Jean', message: 'D\'accord, merci pour l\'info', date: '10:27', lu: true, isMine: true, luPar: ['M. NGOMA'] },
        { id: 'm3', expediteurId: '3', expediteurNom: 'Marie', message: 'Est-ce qu\'on aura un rattrapage ?', date: '10:28', lu: false, isMine: false, luPar: [] },
        { id: 'm4', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Oui, je vous préviendrai', date: '10:30', lu: false, isMine: false, luPar: [] },
      ]
    },
    { 
      id: '2', 
      nom: 'Club Informatique', 
      prenoms: '', 
      dernierMessage: 'Hackathon ce samedi à 9h', 
      date: '09:15', 
      nonLus: 2, 
      type: 'groupe',
      estGroupe: true,
      online: true,
      membres: ['M. WAMBA', 'Jean', 'Marie', 'Paul', 'Claire'],
      messages: [
        { id: 'm5', expediteurId: '4', expediteurNom: 'M. WAMBA', message: 'Hackathon ce samedi à 9h en salle info', date: '09:10', lu: true, isMine: false, luPar: ['Jean', 'Marie'] },
        { id: 'm6', expediteurId: '2', expediteurNom: 'Jean', message: 'Super, je serai là !', date: '09:12', lu: true, isMine: true, luPar: ['M. WAMBA'] },
        { id: 'm7', expediteurId: '5', expediteurNom: 'Paul', message: 'Moi aussi !', date: '09:15', lu: false, isMine: false, luPar: [] },
      ]
    },
    { 
      id: '3', 
      nom: 'Réclamation', 
      prenoms: 'Service', 
      dernierMessage: 'Votre réclamation a été prise en compte', 
      date: 'Hier', 
      nonLus: 1, 
      type: 'professeur',
      estGroupe: false,
      messages: [
        { id: 'm8', expediteurId: '2', expediteurNom: 'Jean', message: 'Bonjour, j\'ai un problème avec ma note de maths', date: 'Hier 14:00', lu: true, isMine: true, luPar: ['Service'] },
        { id: 'm9', expediteurId: '6', expediteurNom: 'Service Réclamation', message: 'Votre réclamation a été prise en compte', date: 'Hier 16:00', lu: false, isMine: false, luPar: [] },
      ]
    },
    { 
      id: '4', 
      nom: 'NGOMA', 
      prenoms: 'Paul', 
      dernierMessage: 'Cours de mathématiques demain 8h', 
      date: '11:20', 
      nonLus: 0, 
      online: true, 
      type: 'professeur',
      estGroupe: false,
      messages: [
        { id: 'm10', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Cours de mathématiques demain 8h salle A101', date: '11:15', lu: true, isMine: false, luPar: ['Jean'] },
        { id: 'm11', expediteurId: '2', expediteurNom: 'Jean', message: 'D\'accord, merci Monsieur', date: '11:18', lu: true, isMine: true, luPar: ['M. NGOMA'] },
        { id: 'm12', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Apportez vos cahiers', date: '11:20', lu: true, isMine: false, luPar: ['Jean'] },
      ]
    },
    { 
      id: '5', 
      nom: 'LOUBAKI', 
      prenoms: 'Marie', 
      dernierMessage: 'Rendez-vous à 14h pour le TD', 
      date: '08:45', 
      nonLus: 0, 
      type: 'professeur',
      estGroupe: false,
      messages: [
        { id: 'm13', expediteurId: '7', expediteurNom: 'Mme LOUBAKI', message: 'Rendez-vous à 14h pour le TD en salle A102', date: '08:40', lu: true, isMine: false, luPar: ['Jean'] },
        { id: 'm14', expediteurId: '2', expediteurNom: 'Jean', message: 'Je serai là', date: '08:42', lu: true, isMine: true, luPar: ['Mme LOUBAKI'] },
      ]
    },
  ],
  parent: [
    { 
      id: '6', 
      nom: 'Groupe Parents', 
      prenoms: '', 
      dernierMessage: 'Réunion des parents le 25 oct', 
      date: '12:00', 
      nonLus: 2, 
      type: 'groupe',
      estGroupe: true,
      membres: ['Mme MOUKOKO', 'M. NGAPI', 'Mme LOUBAKI', 'M. WAMBA'],
      messages: [
        { id: 'm15', expediteurId: '8', expediteurNom: 'Mme MOUKOKO', message: 'Réunion des parents le 25 oct à 18h', date: '11:55', lu: true, isMine: false, luPar: ['M. NGAPI'] },
        { id: 'm16', expediteurId: '9', expediteurNom: 'M. NGAPI', message: 'Je serai présent', date: '11:58', lu: true, isMine: true, luPar: ['Mme MOUKOKO'] },
        { id: 'm17', expediteurId: '10', expediteurNom: 'Mme LOUBAKI', message: 'Moi aussi', date: '12:00', lu: false, isMine: false, luPar: [] },
      ]
    },
    { 
      id: '7', 
      nom: 'Enfant', 
      prenoms: 'Jean Junior', 
      dernierMessage: 'Merci de m\'avoir récupéré', 
      date: '11:20', 
      nonLus: 0, 
      online: true, 
      type: 'eleve',
      estGroupe: false,
      messages: [
        { id: 'm18', expediteurId: '2', expediteurNom: 'Jean Junior', message: 'Merci de m\'avoir récupéré', date: '11:15', lu: true, isMine: true, luPar: ['Parent'] },
        { id: 'm19', expediteurId: '9', expediteurNom: 'Parent', message: 'Avec plaisir, à ce soir', date: '11:18', lu: true, isMine: false, luPar: ['Jean Junior'] },
      ]
    },
    { 
      id: '8', 
      nom: 'LOUBAKI', 
      prenoms: 'Marie', 
      dernierMessage: 'Votre enfant a fait des progrès', 
      date: '08:45', 
      nonLus: 1, 
      type: 'professeur',
      estGroupe: false,
      messages: [
        { id: 'm20', expediteurId: '7', expediteurNom: 'Mme LOUBAKI', message: 'Votre enfant a fait des progrès en maths', date: '08:40', lu: false, isMine: false, luPar: [] },
      ]
    },
  ],
  teacher: [
    { 
      id: '9', 
      nom: 'Département Mathématiques', 
      prenoms: '', 
      dernierMessage: 'Réunion des profs demain 15h', 
      date: '13:00', 
      nonLus: 3, 
      type: 'groupe',
      estGroupe: true,
      membres: ['M. NGOMA', 'Mme LOUBAKI', 'M. MFOUMOU'],
      messages: [
        { id: 'm21', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Réunion des profs demain 15h', date: '12:55', lu: true, isMine: false, luPar: ['Mme LOUBAKI'] },
        { id: 'm22', expediteurId: '7', expediteurNom: 'Mme LOUBAKI', message: 'D\'accord, je serai là', date: '12:57', lu: true, isMine: false, luPar: ['M. NGOMA'] },
        { id: 'm23', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Préparez les bilans', date: '13:00', lu: false, isMine: false, luPar: [] },
      ]
    },
    { 
      id: '10', 
      nom: 'MFOUMOU', 
      prenoms: 'Alain', 
      dernierMessage: 'Réunion des profs demain', 
      date: '12:30', 
      nonLus: 0, 
      type: 'professeur',
      estGroupe: false,
      messages: [
        { id: 'm24', expediteurId: '4', expediteurNom: 'M. MFOUMOU', message: 'Réunion des profs demain 15h', date: '12:25', lu: true, isMine: false, luPar: ['M. NGOMA'] },
        { id: 'm25', expediteurId: '1', expediteurNom: 'M. NGOMA', message: 'Merci, je serai là', date: '12:28', lu: true, isMine: true, luPar: ['M. MFOUMOU'] },
      ]
    },
    { 
      id: '11', 
      nom: 'Élèves 3ème A', 
      prenoms: '', 
      dernierMessage: 'Bonjour Monsieur, nous avons une question', 
      date: '10:00', 
      nonLus: 5, 
      type: 'groupe',
      estGroupe: true,
      membres: ['Jean', 'Marie', 'Paul', 'Claire'],
      messages: [
        { id: 'm26', expediteurId: '2', expediteurNom: 'Jean', message: 'Bonjour Monsieur, nous avons une question sur le cours', date: '09:55', lu: false, isMine: false, luPar: [] },
        { id: 'm27', expediteurId: '3', expediteurNom: 'Marie', message: 'Oui, on ne comprend pas bien le théorème', date: '09:57', lu: false, isMine: false, luPar: [] },
      ]
    },
  ],
};

// ─── Composant Message Detail ──────────────────────────────────────────────
interface MessageDetailProps {
  conversation: Conversation | null;
  onBack: () => void;
  currentUser: string;
  currentUserName: string;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ 
  conversation, 
  onBack, 
  currentUser,
  currentUserName 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      expediteurId: currentUser,
      expediteurNom: currentUserName || 'Moi',
      message: message.trim(),
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: false,
      isMine: true,
      luPar: [],
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleLongPress = (msg: Message) => {
    setSelectedMessage(msg);
    setModalVisible(true);
  };

  const deleteMessage = (messageId: string) => {
    Alert.alert(
      'Supprimer le message',
      'Voulez-vous vraiment supprimer ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setMessages(messages.filter(m => m.id !== messageId));
            setModalVisible(false);
            setSelectedMessage(null);
          }
        },
      ]
    );
  };

  const getMessageStatus = (item: Message) => {
    if (item.isMine) {
      if (item.luPar && item.luPar.length > 0) {
        return { icon: 'check-check', color: C.green, label: 'Lu' };
      }
      return { icon: 'check', color: C.textMuted, label: 'Envoyé' };
    }
    return null;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const status = getMessageStatus(item);
    const isGroupe = conversation?.estGroupe || false;
    const showExpediteur = isGroupe && !item.isMine;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={() => handleLongPress(item)}
        style={{
          alignSelf: item.isMine ? 'flex-end' : 'flex-start',
          backgroundColor: item.isMine ? C.accent : C.surfaceAlt,
          borderRadius: 16,
          borderTopRightRadius: item.isMine ? 4 : 16,
          borderTopLeftRadius: item.isMine ? 16 : 4,
          padding: 12,
          marginVertical: 4,
          maxWidth: '75%',
          borderWidth: 1,
          borderColor: item.isMine ? C.accent : C.border,
        }}
      >
        {showExpediteur && (
          <Text style={{
            fontSize: 11,
            fontWeight: '600',
            color: C.blue,
            marginBottom: 4,
          }}>
            {item.expediteurNom}
          </Text>
        )}
        
        <Text style={{
          fontSize: 14,
          color: item.isMine ? '#FFFFFF' : C.textPrimary,
        }}>
          {item.message}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 4,
          gap: 6,
        }}>
          <Text style={{
            fontSize: 9,
            color: item.isMine ? 'rgba(255,255,255,0.6)' : C.textMuted,
          }}>
            {item.date}
          </Text>
          {status && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Feather name={status.icon as any} size={12} color={status.color} />
              {item.isMine && item.luPar && item.luPar.length > 0 && (
                <Text style={{
                  fontSize: 8,
                  color: status.color,
                  marginLeft: 2,
                }}>
                  {item.luPar.length} {item.luPar.length > 1 ? 'lecteurs' : 'lecteur'}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header du chat */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: C.surface,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <Feather name="arrow-left" size={24} color={C.textPrimary} />
        </TouchableOpacity>
        
        {conversation && (
          <>
            <Avatar 
              name={conversation.prenoms ? `${conversation.prenoms} ${conversation.nom}` : conversation.nom}
              size="sm"
              variant="circle"
              gradient
              ring={conversation.online}
              ringColor={C.green}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.textPrimary }}>
                {conversation.prenoms ? `${conversation.prenoms} ${conversation.nom}` : conversation.nom}
              </Text>
              {conversation.online && (
                <Text style={{ fontSize: 11, color: C.green }}>En ligne</Text>
              )}
              {conversation.estGroupe && conversation.membres && (
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  {conversation.membres.length} membres
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: C.surface,
        borderTopWidth: 1,
        borderTopColor: C.border,
      }}>
        <TouchableOpacity style={{ padding: 8 }}>
          <Feather name="paperclip" size={20} color={C.textMuted} />
        </TouchableOpacity>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: C.surfaceAlt,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
            color: C.textPrimary,
            borderWidth: 1,
            borderColor: C.border,
            marginHorizontal: 8,
            maxHeight: 100,
          }}
          placeholder="Écrire un message..."
          placeholderTextColor={C.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={{
            backgroundColor: message.trim() ? C.accent : C.surfaceAlt,
            borderRadius: 12,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Feather name="send" size={20} color={message.trim() ? '#FFFFFF' : C.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Modal d'actions sur le message */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 20,
            padding: 20,
            width: '80%',
            maxWidth: 320,
            borderWidth: 1,
            borderColor: C.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: C.textPrimary,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Actions
            </Text>
            {selectedMessage && (
              <Text style={{
                fontSize: 13,
                color: C.textMuted,
                textAlign: 'center',
                marginBottom: 16,
                fontStyle: 'italic',
              }}>
                "{selectedMessage.message}"
              </Text>
            )}
            
            {selectedMessage?.isMine && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => selectedMessage && deleteMessage(selectedMessage.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: C.redBg,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: C.red + '30',
                }}
              >
                <Feather name="trash-2" size={18} color={C.red} />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: C.red,
                  marginLeft: 10,
                }}>
                  Supprimer le message
                </Text>
              </TouchableOpacity>
            )}

            {!selectedMessage?.isMine && (
              <View style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: C.surfaceAlt,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 13,
                  color: C.textMuted,
                  textAlign: 'center',
                }}>
                  Vous ne pouvez pas supprimer ce message
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 12,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.textMuted,
              }}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── Composant Conversation List ───────────────────────────────────────────
export const MessagingScreen: React.FC<MessagingScreenProps> = ({ type, onBack }) => {
  const { user } = useAppStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'groupes'>('conversations');

  useEffect(() => {
    const userType = type === 'student' ? 'student' : type === 'parent' ? 'parent' : 'teacher';
    setConversations(MOCK_CONVERSATIONS[userType] || []);
  }, [type]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getConversationTypeLabel = (conv: Conversation) => {
    switch (conv.type) {
      case 'eleve': return 'Élève';
      case 'parent': return 'Parent';
      case 'professeur': return 'Professeur';
      case 'groupe': return 'Groupe';
      default: return '';
    }
  };

  const getConversationTypeColor = (conv: Conversation) => {
    switch (conv.type) {
      case 'eleve': return C.blue;
      case 'parent': return C.green;
      case 'professeur': return C.purple;
      case 'groupe': return C.amber;
      default: return C.textMuted;
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const fullName = item.prenoms ? `${item.prenoms} ${item.nom}` : item.nom;
    const typeColor = getConversationTypeColor(item);
    const typeLabel = getConversationTypeLabel(item);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedConversation(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: C.surface,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}
      >
        <Avatar
          name={fullName}
          size="md"
          variant="circle"
          gradient
          ring={item.online}
          ringColor={C.green}
        />
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.textPrimary }}>
              {fullName}
            </Text>
            <Text style={{ fontSize: 10, color: C.textMuted }}>
              {item.date}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Text 
              style={{ 
                fontSize: 13, 
                color: item.nonLus > 0 ? C.textSecondary : C.textMuted,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.dernierMessage}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {typeLabel && (
                <View style={{
                  backgroundColor: typeColor + '20',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}>
                  <Text style={{
                    fontSize: 8,
                    fontWeight: '600',
                    color: typeColor,
                  }}>
                    {typeLabel}
                  </Text>
                </View>
              )}
              {item.nonLus > 0 && (
                <View style={{
                  backgroundColor: C.accent,
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 4,
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF' }}>
                    {item.nonLus}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {item.membres && item.membres.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Feather name="users" size={10} color={C.textMuted} />
              <Text style={{ fontSize: 9, color: C.textMuted, marginLeft: 4 }}>
                {item.membres.length} membres
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedConversation) {
    return (
      <Layout variant="default" withSafeArea={false}>
        <MessageDetail 
          conversation={selectedConversation} 
          onBack={() => setSelectedConversation(null)}
          currentUser={user?.id || '1'}
          currentUserName={user?.prenoms || 'Moi'}
        />
      </Layout>
    );
  }

  const conversationsList = conversations.filter(c => activeTab === 'conversations' ? c.type !== 'groupe' : c.type === 'groupe');
  const groupesList = conversations.filter(c => c.type === 'groupe');

  return (
    <Layout variant="default" withSafeArea={false}>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        {/* Header */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 20,
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
                  Messagerie
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Conversations
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: 10,
              }}
            >
              <Feather name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Conversations', value: conversations.length.toString(), icon: 'message-circle' },
              { label: 'Non lus', value: conversations.filter(c => c.nonLus > 0).reduce((acc, c) => acc + c.nonLus, 0).toString(), icon: 'bell' },
              { label: 'Groupes', value: groupesList.length.toString(), icon: 'users' },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
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
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.6)" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.4)',
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

        {/* Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: C.surface,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('conversations')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: activeTab === 'conversations' ? C.accentBg : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: activeTab === 'conversations' ? '700' : '600',
              color: activeTab === 'conversations' ? C.accentDim : C.textMuted,
            }}>
              Conversations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('groupes')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: activeTab === 'groupes' ? C.accentBg : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: activeTab === 'groupes' ? '700' : '600',
              color: activeTab === 'groupes' ? C.accentDim : C.textMuted,
            }}>
              Groupes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste des conversations */}
        <FlatList
          data={conversationsList}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
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
                <Feather name="message-circle" size={36} color={C.accentDim} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                Aucune {activeTab === 'conversations' ? 'conversation' : 'groupe'}
              </Text>
              <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>
                {activeTab === 'conversations' 
                  ? 'Vous n\'avez pas encore de conversations' 
                  : 'Vous n\'êtes pas encore dans un groupe'}
              </Text>
            </View>
          }
        />
      </View>
    </Layout>
  );
};