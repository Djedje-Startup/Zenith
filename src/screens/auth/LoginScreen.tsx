// screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

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
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 100 }}
            className="items-center mb-10"
          >
            <LinearGradient
              colors={['#F5A623', '#E0950A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
            >
              <Feather name="sun" size={40} color="white" />
            </LinearGradient>
            
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              ZENITH
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              L'application mobile SURYA
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
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Feather name="lock" size={18} color="#94A3B8" />}
              rightIcon={
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color="#94A3B8"
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          </MotiView>

          {/* Erreur */}
          {error ? (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4"
            >
              <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </Text>
            </MotiView>
          ) : null}

          {/* Bouton de connexion */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 300 }}
          >
            <Button
              title={isLoading ? 'Connexion en cours...' : 'Se connecter'}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="lg"
            />
          </MotiView>

          {/* Mot de passe oublié */}
          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-primary-500 text-sm font-medium">
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          {/* Version */}
          <Text className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};