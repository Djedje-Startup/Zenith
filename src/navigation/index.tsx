// navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Import des écrans d'authentification
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SelectSchoolScreen } from '../screens/auth/SelectSchoolScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// Import des écrans parents
import { ParentHomeScreen } from '../screens/parent/ParentHomeScreen';
import { ChildrenListScreen } from '../screens/parent/ChildrenListScreen';
import { ChildDetailScreen } from '../screens/parent/ChildDetailScreen';
import { ParentTimetableScreen } from '../screens/parent/ParentTimetableScreen';
import { ParentGradesScreen } from '../screens/parent/ParentGradesScreen';
import { ParentClubsScreen } from '../screens/parent/ParentClubsScreen';
import { ParentPaymentsScreen } from '../screens/parent/ParentPaymentsScreen';
import { ParentPaymentHistoryScreen } from '../screens/parent/ParentPaymentHistoryScreen';
import { ParentComplaintScreen } from '../screens/parent/ParentComplaintScreen';

// Import des écrans élèves
import { StudentHomeScreen } from '../screens/eleve/StudentHomeScreen';
import { StudentTimetableScreen } from '../screens/eleve/StudentTimetableScreen';
import { StudentGradesScreen } from '../screens/eleve/StudentGradesScreen';
import { StudentGradeDetailScreen } from '../screens/eleve/StudentGradeDetailScreen';
import { StudentClubsScreen } from '../screens/eleve/StudentClubsScreen';
import { StudentClubDetailScreen } from '../screens/eleve/StudentClubDetailScreen';
import { StudentAttendanceScreen } from '../screens/eleve/StudentAttendanceScreen';
import { StudentPaymentsScreen } from '../screens/eleve/StudentPaymentsScreen';

// Import des écrans professeurs
import { TeacherHomeScreen } from '../screens/professeur/TeacherHomeScreen';
import { TeacherClassesScreen } from '../screens/professeur/TeacherClassesScreen';
import { TeacherClassDetailScreen } from '../screens/professeur/TeacherClassDetailScreen';
import { TeacherGradeEntryScreen } from '../screens/professeur/TeacherGradeEntryScreen';
import { TeacherAttendanceScreen } from '../screens/professeur/TeacherAttendanceScreen';
import { TeacherTimetableScreen } from '../screens/professeur/TeacherTimetableScreen';
import { TeacherClubsScreen } from '../screens/professeur/TeacherClubsScreen';

// Import des écrans partagés
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { AboutScreen } from '../screens/shared/AboutScreen';

// Types pour la navigation
export type RootStackParamList = {
  // Auth
  Login: undefined;
  SelectSchool: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string; email: string };
  // Main
  Main: undefined;
  // Shared
  Profile: undefined;
  Notifications: undefined;
  Settings: undefined;
  About: undefined;
  // Parent
  ChildrenList: undefined;
  ChildDetail: { childId: string };
  ParentTimetable: { childId: string };
  ParentGrades: { childId: string };
  ParentClubs: { childId: string };
  ParentPayments: { childId: string };
  ParentPaymentHistory: { childId: string };
  ParentComplaint: { childId?: string; childName?: string };
  // Student
  StudentTimetable: undefined;
  StudentGrades: undefined;
  StudentGradeDetail: { reportId: string };
  StudentClubs: undefined;
  StudentClubDetail: { clubId: string };
  StudentAttendance: undefined;
  StudentPayments: undefined;
  // Teacher
  TeacherClasses: undefined;
  TeacherClassDetail: { classeId: string; className?: string };
  TeacherGradeEntry: { classeId?: string; className?: string };
  TeacherAttendance: { classeId?: string; className?: string };
  TeacherTimetable: undefined;
  TeacherClubs: undefined;
};

// Types pour les onglets
export type ParentTabParamList = {
  Accueil: undefined;
  Enfants: undefined;
  Paiements: undefined;
  Profil: undefined;
};

export type StudentTabParamList = {
  Accueil: undefined;
  'Emploi du temps': undefined;
  Notes: undefined;
  Profil: undefined;
};

export type TeacherTabParamList = {
  Accueil: undefined;
  'Mes classes': undefined;
  'Emploi du temps': undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();

// Tab Navigator selon le rôle
const ParentTabs = () => {
  const [isDark] = React.useState(false); // À connecter avec useTheme

  return (
    <ParentTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'circle';
          if (route.name === 'Accueil') iconName = 'home';
          if (route.name === 'Enfants') iconName = 'users';
          if (route.name === 'Paiements') iconName = 'credit-card';
          if (route.name === 'Profil') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: isDark ? '#1A1D26' : '#FFFFFF',
        },
        headerShown: false,
      })}
    >
      <ParentTab.Screen name="Accueil" component={ParentHomeScreen} />
      <ParentTab.Screen name="Enfants" component={ChildrenListScreen} />
      <ParentTab.Screen name="Paiements" component={ParentPaymentsScreen} />
      <ParentTab.Screen name="Profil" component={ProfileScreen} />
    </ParentTab.Navigator>
  );
};

const StudentTabs = () => {
  const [isDark] = React.useState(false);

  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'circle';
          if (route.name === 'Accueil') iconName = 'home';
          if (route.name === 'Emploi du temps') iconName = 'calendar';
          if (route.name === 'Notes') iconName = 'book-open';
          if (route.name === 'Profil') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: isDark ? '#1A1D26' : '#FFFFFF',
        },
        headerShown: false,
      })}
    >
      <StudentTab.Screen name="Accueil" component={StudentHomeScreen} />
      <StudentTab.Screen name="Emploi du temps" component={StudentTimetableScreen} />
      <StudentTab.Screen name="Notes" component={StudentGradesScreen} />
      <StudentTab.Screen name="Profil" component={ProfileScreen} />
    </StudentTab.Navigator>
  );
};

const TeacherTabs = () => {
  const [isDark] = React.useState(false);

  return (
    <TeacherTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'circle';
          if (route.name === 'Accueil') iconName = 'home';
          if (route.name === 'Mes classes') iconName = 'users';
          if (route.name === 'Emploi du temps') iconName = 'calendar';
          if (route.name === 'Profil') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: isDark ? '#1A1D26' : '#FFFFFF',
        },
        headerShown: false,
      })}
    >
      <TeacherTab.Screen name="Accueil" component={TeacherHomeScreen} />
      <TeacherTab.Screen name="Mes classes" component={TeacherClassesScreen} />
      <TeacherTab.Screen name="Emploi du temps" component={TeacherTimetableScreen} />
      <TeacherTab.Screen name="Profil" component={ProfileScreen} />
    </TeacherTab.Navigator>
  );
};

// Stack Navigator principal
export const AppNavigator = () => {
  const [isAuthenticated] = React.useState(true);
  const [userRole] = React.useState<'PARENT' | 'ELEVE' | 'PROFESSEUR'>('PARENT');

  const getMainTabs = () => {
    switch (userRole) {
      case 'PARENT':
        return ParentTabs;
      case 'ELEVE':
        return StudentTabs;
      case 'PROFESSEUR':
        return TeacherTabs;
      default:
        return ParentTabs;
    }
  };

  const MainTabsComponent = getMainTabs();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Écrans d'authentification
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SelectSchool" component={SelectSchoolScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        // Écrans authentifiés
        <>
          <Stack.Screen name="Main" component={MainTabsComponent} />

          {/* Écrans communs */}
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />

          {/* Écrans parents */}
          <Stack.Screen name="ChildrenList" component={ChildrenListScreen} />
          <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />
          <Stack.Screen name="ParentTimetable" component={ParentTimetableScreen} />
          <Stack.Screen name="ParentGrades" component={ParentGradesScreen} />
          <Stack.Screen name="ParentClubs" component={ParentClubsScreen} />
          <Stack.Screen name="ParentPayments" component={ParentPaymentsScreen} />
          <Stack.Screen name="ParentPaymentHistory" component={ParentPaymentHistoryScreen} />
          <Stack.Screen name="ParentComplaint" component={ParentComplaintScreen} />

          {/* Écrans élèves */}
          <Stack.Screen name="StudentTimetable" component={StudentTimetableScreen} />
          <Stack.Screen name="StudentGrades" component={StudentGradesScreen} />
          <Stack.Screen name="StudentGradeDetail" component={StudentGradeDetailScreen} />
          <Stack.Screen name="StudentClubs" component={StudentClubsScreen} />
          <Stack.Screen name="StudentClubDetail" component={StudentClubDetailScreen} />
          <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
          <Stack.Screen name="StudentPayments" component={StudentPaymentsScreen} />

          {/* Écrans professeurs */}
          <Stack.Screen name="TeacherClasses" component={TeacherClassesScreen} />
          <Stack.Screen name="TeacherClassDetail" component={TeacherClassDetailScreen} />
          <Stack.Screen name="TeacherGradeEntry" component={TeacherGradeEntryScreen} />
          <Stack.Screen name="TeacherAttendance" component={TeacherAttendanceScreen} />
          <Stack.Screen name="TeacherTimetable" component={TeacherTimetableScreen} />
          <Stack.Screen name="TeacherClubs" component={TeacherClubsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};