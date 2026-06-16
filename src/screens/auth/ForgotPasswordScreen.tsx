// screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="items-center"
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
            >
              <Feather name="check" size={40} color="white" />
            </LinearGradient>

            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Email envoyé !
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-3">
              Nous vous avons envoyé un lien de réinitialisation à votre adresse email.
            </Text>

            <Button
              title="Retour à la connexion"
              onPress={() => {}}
              variant="primary"
              size="lg"
              className="mt-8"
            />
          </MotiView>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <StatusBar style="dark" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white dark:bg-gray-900"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 100 }}
            className="items-center mb-8"
          >
            <TouchableOpacity className="absolute left-0 top-0 p-2">
              <Feather name="arrow-left" size={24} color="#F5A623" />
            </TouchableOpacity>
            
            <LinearGradient
              colors={['#F5A623', '#E0950A']}
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
            >
              <Feather name="key" size={28} color="white" />
            </LinearGradient>
            
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Mot de passe oublié
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </MotiView>

          {/* Formulaire */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', delay: 200 }}
            className="mb-6"
          >
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
              error={error}
            />
          </MotiView>

          {/* Bouton d'envoi */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 300 }}
          >
            <Button
              title={isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
              onPress={handleSend}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="lg"
            />
          </MotiView>

          {/* Lien retour */}
          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-primary-500 text-sm font-medium">
              Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};