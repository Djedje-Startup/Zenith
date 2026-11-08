// navigation/index.tsx
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { useAppStore } from '../store';
import { useTheme } from '../theme';

// ─── Écrans d'authentification ──────────────────────────────────────────────
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SelectSchoolScreen } from '../screens/auth/SelectSchoolScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// ─── Écrans parents ──────────────────────────────────────────────────────────
import { ParentHomeScreen } from '../screens/parent/ParentHomeScreen';
import { ChildrenListScreen } from '../screens/parent/ChildrenListScreen';
import { ChildDetailScreen } from '../screens/parent/ChildDetailScreen';
import { ParentTimetableScreen } from '../screens/parent/ParentTimetableScreen';
import { ParentGradesScreen } from '../screens/parent/ParentGradesScreen';
import { ParentClubsScreen } from '../screens/parent/ParentClubsScreen';
import { ParentPaymentsScreen } from '../screens/parent/ParentPaymentsScreen';
import { ParentPaymentHistoryScreen } from '../screens/parent/ParentPaymentHistoryScreen';
import { ParentComplaintScreen } from '../screens/parent/ParentComplaintScreen';

// ─── Écrans élèves ────────────────────────────────────────────────────────────
import { StudentHomeScreen } from '../screens/eleve/StudentHomeScreen';
import { StudentTimetableScreen } from '../screens/eleve/StudentTimetableScreen';
import { StudentGradesScreen } from '../screens/eleve/StudentGradesScreen';
import { StudentGradeDetailScreen } from '../screens/eleve/StudentGradeDetailScreen';
import { StudentClubsScreen } from '../screens/eleve/StudentClubsScreen';
import { StudentClubDetailScreen } from '../screens/eleve/StudentClubDetailScreen';
import { StudentAttendanceScreen } from '../screens/eleve/StudentAttendanceScreen';
import { StudentPaymentsScreen } from '../screens/eleve/StudentPaymentsScreen';
import { StudentComplaintScreen } from '../screens/eleve/StudentComplaintScreen';
import { StudentElectionsScreen } from '../screens/eleve/StudentElectionsScreen';
import { StudentCourseScreen } from '../screens/eleve/StudentCourseScreen';
import { StudentLibraryScreen } from '../screens/eleve/StudentLibraryScreen';
import { StudentRoomsScreen } from '../screens/eleve/StudentRoomsScreen';
import { StudentPaymentHistoryScreen } from '../screens/eleve/StudentPaymentHistoryScreen';

// ─── Écrans professeurs ──────────────────────────────────────────────────────
import { TeacherHomeScreen } from '../screens/professeur/TeacherHomeScreen';
import { TeacherClassesScreen } from '../screens/professeur/TeacherClassesScreen';
import { TeacherClassDetailScreen } from '../screens/professeur/TeacherClassDetailScreen';
import { TeacherGradeEntryScreen } from '../screens/professeur/TeacherGradeEntryScreen';
import { TeacherAttendanceScreen } from '../screens/professeur/TeacherAttendanceScreen';
import { TeacherTimetableScreen } from '../screens/professeur/TeacherTimetableScreen';
import { TeacherClubsScreen } from '../screens/professeur/TeacherClubsScreen';
import { TeacherPaySlipsScreen } from '../screens/professeur/TeacherPaySlipsScreen';

// ─── Écrans partagés ──────────────────────────────────────────────────────────
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { AboutScreen } from '../screens/shared/AboutScreen';
import { MessagingScreen } from '../screens/shared/MessagingScreen';
import { AnnouncementsScreen } from '../screens/shared/AnnouncementsScreen';

// Écrans supplémentaires
import { PersonalInfoScreen } from '../screens/shared/PersonalInfoScreen';
import { SecurityScreen } from '../screens/shared/SecurityScreen';
import { PreferencesScreen } from '../screens/shared/PreferencesScreen';

// ─── Composants UI ────────────────────────────────────────────────────────────
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// ──────────────────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Login: undefined;
  SelectSchool: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string; email: string };
  Main: undefined;
  Profile: undefined;
  Notifications: undefined;
  Settings: undefined;
  About: undefined;
  PersonalInfo: undefined;
  Security: undefined;
  Preferences: undefined;
  Messaging: { type: 'student' | 'parent' | 'teacher' };
  Announcements: { userRole: 'student' | 'parent' | 'teacher' };
  ChildrenList: undefined;
  ChildDetail: { childId: string };
  ParentTimetable: { childId: string };
  ParentGrades: { childId: string };
  ParentClubs: { childId: string };
  ParentPayments: { childId: string };
  ParentPaymentHistory: { childId: string };
  ParentComplaint: { childId?: string; childName?: string };
  StudentTimetable: undefined;
  StudentGrades: undefined;
  StudentGradeDetail: { reportId: string };
  StudentClubs: undefined;
  StudentClubDetail: { clubId: string };
  StudentAttendance: undefined;
  StudentPayments: undefined;
  StudentComplaint: undefined;
  StudentElections: undefined;
  StudentCourse: undefined;
  StudentLibrary: undefined;
  StudentRooms: undefined;
  StudentPaymentHistory: undefined;
  TeacherClasses: undefined;
  TeacherClassDetail: { classeId: string; className?: string };
  TeacherGradeEntry: { classeId?: string; className?: string };
  TeacherAttendance: { classeId?: string; className?: string };
  TeacherTimetable: undefined;
  TeacherClubs: undefined;
  TeacherPaySlips: undefined;
};

export type ParentTabParamList = {
  Accueil: undefined;
  Enfants: undefined;
  Paiements: undefined;
  Profil: undefined;
};

export type StudentTabParamList = {
  Accueil: undefined;
  Emploi: undefined;
  Notes: undefined;
  Profil: undefined;
};

export type TeacherTabParamList = {
  Accueil: undefined;
  Classes: undefined;
  Emploi: undefined;
  Profil: undefined;
};

// ─── Tab Navigators ───────────────────────────────────────────────────────────
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();

const getTabScreenOptions = (theme: any) => ({
  headerShown: false,
  tabBarActiveTintColor: theme.primary,
  tabBarInactiveTintColor: '#8E8E93',
  tabBarStyle: {
    backgroundColor: theme.card || '#FFFFFF',
    borderTopColor: theme.border || 'rgba(0,0,0,0.1)',
    height: Platform.OS === 'ios' ? 88 : 60,
    paddingBottom: Platform.OS === 'ios' ? 30 : 8,
    paddingTop: 8,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});

const ParentTabs = () => {
  const { theme } = useTheme();
  return (
    <ParentTab.Navigator screenOptions={getTabScreenOptions(theme)}>
      <ParentTab.Screen
        name="Accueil"
        component={ParentHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <ParentTab.Screen
        name="Enfants"
        component={ChildrenListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <ParentTab.Screen
        name="Paiements"
        component={ParentPaymentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} />,
        }}
      />
      <ParentTab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </ParentTab.Navigator>
  );
};

const StudentTabs = () => {
  const { theme } = useTheme();
  return (
    <StudentTab.Navigator screenOptions={getTabScreenOptions(theme)}>
      <StudentTab.Screen
        name="Accueil"
        component={StudentHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="Emploi"
        component={StudentTimetableScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="Notes"
        component={StudentGradesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </StudentTab.Navigator>
  );
};

const TeacherTabs = () => {
  const { theme } = useTheme();
  return (
    <TeacherTab.Navigator screenOptions={getTabScreenOptions(theme)}>
      <TeacherTab.Screen
        name="Accueil"
        component={TeacherHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <TeacherTab.Screen
        name="Classes"
        component={TeacherClassesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <TeacherTab.Screen
        name="Emploi"
        component={TeacherTimetableScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <TeacherTab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </TeacherTab.Navigator>
  );
};

// ─── Stack Navigator ──────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();

const slideFromRight = { animation: 'slide_from_right' as const, animationDuration: 260 };
const slideFromBottom = { animation: 'slide_from_bottom' as const, animationDuration: 300 };
const fade = { animation: 'fade' as const, animationDuration: 350 };

export const AppNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAppStore();
  const { theme } = useTheme();
  const userRole = user?.role ?? 'PARENT';

  if (isLoading) return <LoadingSpinner fullScreen text="Chargement..." />;

  const MainTabsComponent =
    userRole === 'ELEVE' ? StudentTabs :
    userRole === 'PROFESSEUR' ? TeacherTabs :
    ParentTabs;

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: theme.background },
      animation: 'slide_from_right',
      animationDuration: 260,
    }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={fade} />
          <Stack.Screen name="SelectSchool" component={SelectSchoolScreen} options={slideFromBottom} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={slideFromRight} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={slideFromRight} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabsComponent} options={fade} />

          {/* ─── Écrans partagés ─────────────────────────────────────────── */}
          <Stack.Screen name="Profile" component={ProfileScreen} options={slideFromBottom} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={slideFromBottom} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={slideFromBottom} />
          <Stack.Screen name="About" component={AboutScreen} options={slideFromBottom} />

          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={slideFromBottom} />
          <Stack.Screen name="Security" component={SecurityScreen} options={slideFromBottom} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} options={slideFromBottom} />

          <Stack.Screen name="Messaging" options={slideFromRight}>
            {(props) => <MessagingScreen {...props} type={userRole.toLowerCase() as 'student' | 'parent' | 'teacher'} />}
          </Stack.Screen>

          <Stack.Screen name="Announcements" options={slideFromRight}>
            {(props) => <AnnouncementsScreen {...props} userRole={userRole.toLowerCase() as 'student' | 'parent' | 'teacher'} />}
          </Stack.Screen>

          <Stack.Screen name="ChildrenList" component={ChildrenListScreen} options={slideFromRight} />
          <Stack.Screen name="ChildDetail" component={ChildDetailScreen} options={slideFromRight} />
          <Stack.Screen name="ParentTimetable" component={ParentTimetableScreen} options={slideFromRight} />
          <Stack.Screen name="ParentGrades" component={ParentGradesScreen} options={slideFromRight} />
          <Stack.Screen name="ParentClubs" component={ParentClubsScreen} options={slideFromRight} />
          <Stack.Screen name="ParentPayments" component={ParentPaymentsScreen} options={slideFromRight} />
          <Stack.Screen name="ParentPaymentHistory" component={ParentPaymentHistoryScreen} options={slideFromRight} />
          <Stack.Screen name="ParentComplaint" component={ParentComplaintScreen} options={slideFromBottom} />

          <Stack.Screen name="StudentTimetable" component={StudentTimetableScreen} options={slideFromRight} />
          <Stack.Screen name="StudentGrades" component={StudentGradesScreen} options={slideFromRight} />
          <Stack.Screen name="StudentGradeDetail" component={StudentGradeDetailScreen} options={slideFromRight} />
          <Stack.Screen name="StudentClubs" component={StudentClubsScreen} options={slideFromRight} />
          <Stack.Screen name="StudentClubDetail" component={StudentClubDetailScreen} options={slideFromRight} />
          <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} options={slideFromRight} />
          <Stack.Screen name="StudentPayments" component={StudentPaymentsScreen} options={slideFromRight} />
          <Stack.Screen name="StudentComplaint" component={StudentComplaintScreen} options={slideFromRight} />
          <Stack.Screen name="StudentElections" component={StudentElectionsScreen} options={slideFromRight} />
          <Stack.Screen name="StudentCourse" component={StudentCourseScreen} options={slideFromRight} />
          <Stack.Screen name="StudentLibrary" component={StudentLibraryScreen} options={slideFromRight} />
          <Stack.Screen name="StudentRooms" component={StudentRoomsScreen} options={slideFromRight} />
          <Stack.Screen name="StudentPaymentHistory" component={StudentPaymentHistoryScreen} options={slideFromRight} />

          <Stack.Screen name="TeacherClasses" component={TeacherClassesScreen} options={slideFromRight} />
          <Stack.Screen name="TeacherClassDetail" component={TeacherClassDetailScreen} options={slideFromRight} />
          <Stack.Screen name="TeacherGradeEntry" component={TeacherGradeEntryScreen} options={slideFromBottom} />
          <Stack.Screen name="TeacherAttendance" component={TeacherAttendanceScreen} options={slideFromBottom} />
          <Stack.Screen name="TeacherTimetable" component={TeacherTimetableScreen} options={slideFromRight} />
          <Stack.Screen name="TeacherClubs" component={TeacherClubsScreen} options={slideFromRight} />
          <Stack.Screen name="TeacherPaySlips" component={TeacherPaySlipsScreen} options={slideFromBottom} />
        </>
      )}
    </Stack.Navigator>
  );
};