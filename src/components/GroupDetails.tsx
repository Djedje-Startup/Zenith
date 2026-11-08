// components/GroupDetails.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface GroupDetailsProps {
  visible: boolean;
  onClose: () => void;
  groupName: string;
  members: string[];
  colors: any;
  onReportMember?: (member: string) => void;
}

export const GroupDetails: React.FC<GroupDetailsProps> = ({
  visible,
  onClose,
  groupName,
  members,
  colors,
  onReportMember,
}) => {
  const handleReport = (member: string) => {
    Alert.alert(
      'Signaler un membre',
      `Voulez-vous signaler ${member} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Signaler',
          style: 'destructive',
          onPress: () => onReportMember?.(member),
        },
      ]
    );
  };

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
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          maxHeight: '70%',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.text,
              }}>
                {groupName}
              </Text>
              <Text style={{
                fontSize: 12,
                color: colors.textMuted,
              }}>
                {members.length} membres
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: colors.surfaceElevated,
              }}
            >
              <Feather name="x" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Liste des membres */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: 8 }}>
              {members.map((member, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.primary + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: colors.primary,
                      }}>
                        {member.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 14,
                      color: colors.text,
                    }}>
                      {member}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleReport(member)}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: colors.error + '15',
                    }}
                  >
                    <Feather name="flag" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bouton fermer */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              Fermer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};