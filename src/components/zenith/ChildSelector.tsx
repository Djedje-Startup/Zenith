// components/zenith/ChildSelector.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

export interface Child {
  id: string;
  nom: string;
  prenoms: string;
  classe: string;
  photo?: string;
  schoolId: string;
  schoolName: string;
  moyenne?: number;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
  label?: string;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  selectedChild,
  onSelectChild,
  label = "Sélectionner un enfant",
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (child: Child) => {
    onSelectChild(child);
    setModalVisible(false);
  };

  return (
    <>
      {/* Bouton de sélection */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
      >
        <View className="flex-row items-center gap-3">
          {selectedChild ? (
            <>
              <Avatar
                name={`${selectedChild.nom} ${selectedChild.prenoms}`}
                source={selectedChild.photo}
                size="sm"
              />
              <View>
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedChild.prenoms} {selectedChild.nom}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedChild.classe} • {selectedChild.schoolName}
                </Text>
              </View>
            </>
          ) : (
            <Text className="text-gray-500 dark:text-gray-400">{label}</Text>
          )}
        </View>
        <Feather name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Modal de sélection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <MotiView
            from={{ translateY: 300 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden"
          >
            {/* Header modal */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {label}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Liste des enfants */}
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={cn(
                    'flex-row items-center p-4',
                    selectedChild?.id === item.id && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  <Avatar
                    name={`${item.nom} ${item.prenoms}`}
                    source={item.photo}
                    size="md"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.prenoms} {item.nom}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {item.classe}
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-500">
                      {item.schoolName}
                    </Text>
                  </View>
                  {selectedChild?.id === item.id && (
                    <Feather name="check" size={18} color="#F5A623" />
                  )}
                </TouchableOpacity>
              )}
              className="max-h-96"
            />
          </MotiView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};