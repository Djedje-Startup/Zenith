// components/zenith/SchoolSelector.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { cn } from '../../utils/cn';

export interface School {
  id: string;
  nom: string;
  logo?: string;
  ville: string;
  statut: 'ACTIF' | 'INACTIF';
}

interface SchoolSelectorProps {
  schools: School[];
  selectedSchool: School | null;
  onSelectSchool: (school: School) => void;
  label?: string;
}

export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  label = "Sélectionner un établissement",
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (school: School) => {
    onSelectSchool(school);
    setModalVisible(false);
  };

  const isInactive = (statut: string) => statut === 'INACTIF';

  return (
    <>
      {/* Bouton de sélection */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
      >
        <View className="flex-row items-center gap-3">
          {selectedSchool ? (
            <>
              {selectedSchool.logo ? (
                <Image source={{ uri: selectedSchool.logo }} className="w-8 h-8 rounded-full" />
              ) : (
                <View className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center">
                  <Text className="text-primary-500 font-bold text-sm">
                    {selectedSchool.nom.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedSchool.nom}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedSchool.ville}
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

            {/* Liste des écoles */}
            <FlatList
              data={schools}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const inactive = isInactive(item.statut);
                return (
                  <TouchableOpacity
                    onPress={() => !inactive && handleSelect(item)}
                    disabled={inactive}
                    className={cn(
                      'flex-row items-center p-4',
                      selectedSchool?.id === item.id && 'bg-primary-50 dark:bg-primary-900/20',
                      inactive && 'opacity-50'
                    )}
                  >
                    {item.logo ? (
                      <Image source={{ uri: item.logo }} className="w-10 h-10 rounded-full" />
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center">
                        <Text className="text-primary-500 font-bold text-base">
                          {item.nom.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.nom}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {item.ville}
                      </Text>
                    </View>
                    {selectedSchool?.id === item.id && (
                      <Feather name="check" size={18} color="#F5A623" />
                    )}
                  </TouchableOpacity>
                );
              }}
              className="max-h-96"
            />
          </MotiView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};