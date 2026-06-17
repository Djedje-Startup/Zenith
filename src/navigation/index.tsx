// navigation/index.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { useAppStore } from '../store';

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

// ─── Écrans partagés ──────────────────────────────────────────────────────────
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { AboutScreen } from '../screens/shared/AboutScreen';
import { MessagingScreen } from '../screens/shared/MessagingScreen';
import { AnnouncementsScreen } from '../screens/shared/AnnouncementsScreen';

// ─── Composants UI ────────────────────────────────────────────────────────────
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Couleurs par icône ──────────────────────────────────────────────────────
interface TabColor { active: string; activeBg: string }

const TAB_COLORS: Record<string, TabColor> = {
  'home':        { active: '#818CF8', activeBg: 'rgba(99,102,241,0.20)'  },
  'users':       { active: '#2DD4BF', activeBg: 'rgba(45,212,191,0.18)'  },
  'calendar':    { active: '#34D399', activeBg: 'rgba(52,211,153,0.18)'  },
  'book-open':   { active: '#34D399', activeBg: 'rgba(52,211,153,0.18)'  },
  'credit-card': { active: '#FBBF24', activeBg: 'rgba(251,191,36,0.18)'  },
  'user':        { active: '#F472B6', activeBg: 'rgba(244,114,182,0.18)' },
};
const getTC = (icon: string): TabColor =>
  TAB_COLORS[icon] ?? { active: '#818CF8', activeBg: 'rgba(99,102,241,0.20)' };

// ─── Tab Item ─────────────────────────────────────────────────────────────────
interface TabItem { name: string; label: string; icon: keyof typeof Feather.glyphMap }

// ─── Custom Tab Bar Verticale Déplaçable ─────────────────────────────────────
interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  tabs: TabItem[];
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_HEIGHT = 52;
const TAB_MARGIN = 6;
const TAB_BAR_WIDTH = 68;
const COLLAPSED_HEIGHT = 60;

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation, tabs }) => {
  const [expanded, setExpanded] = useState(true);
  const [position, setPosition] = useState({ x: SCREEN_WIDTH - TAB_BAR_WIDTH - 16, y: SCREEN_HEIGHT / 2 - 100 });
  const expandAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.ValueXY(position)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      onPanResponderMove: (_, gesture) => {
        let newX = position.x + gesture.dx;
        let newY = position.y + gesture.dy;
        
        const barHeight = expanded ? tabs.length * (TAB_HEIGHT + TAB_MARGIN) + 60 : COLLAPSED_HEIGHT;
        newX = Math.max(0, Math.min(SCREEN_WIDTH - TAB_BAR_WIDTH, newX));
        newY = Math.max(0, Math.min(SCREEN_HEIGHT - barHeight - 20, newY));
        
        positionAnim.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: (_, gesture) => {
        const newX = Math.max(0, Math.min(SCREEN_WIDTH - TAB_BAR_WIDTH, position.x + gesture.dx));
        const newY = Math.max(0, Math.min(SCREEN_HEIGHT - (expanded ? tabs.length * (TAB_HEIGHT + TAB_MARGIN) + 60 : COLLAPSED_HEIGHT) - 20, position.y + gesture.dy));
        setPosition({ x: newX, y: newY });
        scheduleCollapse();
      },
    })
  ).current;

  const animate = (toValue: number, cb?: () => void) => {
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start(cb);
  };

  const scheduleCollapse = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setExpanded(false);
      animate(0);
    }, 4000);
  };

  const toggle = () => {
    if (expanded) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setExpanded(false);
      animate(0);
    } else {
      setExpanded(true);
      animate(1);
      scheduleCollapse();
    }
  };

  useEffect(() => {
    scheduleCollapse();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!expanded) {
      setExpanded(true);
      animate(1);
    }
    scheduleCollapse();
  }, [state.index]);

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  const contentScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });
  const toggleRotate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const containerPaddingVertical = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 10],
  });
  
  const containerMinHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 48],
  });

  const focusedTab = tabs[state.index];
  const focusedTC = focusedTab ? getTC(focusedTab.icon) : getTC('home');

  const totalTabsHeight = tabs.length * (TAB_HEIGHT + TAB_MARGIN) - TAB_MARGIN;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: positionAnim.getTranslateTransform(),
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
      }}
      {...panResponder.panHandlers}
    >
      <View style={{
        width: TAB_BAR_WIDTH - 20,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 4,
      }} />

      <Animated.View style={{
        backgroundColor: '#0A0C12',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: expanded ? '#1C2030' : focusedTC.active + '40',
        paddingVertical: containerPaddingVertical,
        paddingHorizontal: 10,
        shadowColor: expanded ? '#000' : focusedTC.active,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: expanded ? 0.35 : 0.25,
        shadowRadius: expanded ? 16 : 10,
        elevation: 18,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: containerMinHeight,
        minWidth: TAB_BAR_WIDTH - 20,
      }}>
        <Animated.View style={{
          opacity: contentOpacity,
          transform: [{ scale: contentScale }],
          gap: TAB_MARGIN,
          marginBottom: expanded ? 6 : 0,
          maxHeight: expanded ? totalTabsHeight : 0,
          overflow: 'hidden',
        }}>
          {tabs.map((tab, index) => {
            const focused = state.index === index;
            const tc = getTC(tab.icon);
            return (
              <TouchableOpacity
                key={tab.name}
                activeOpacity={0.75}
                onPress={() => {
                  navigation.navigate(tab.name);
                  scheduleCollapse();
                }}
                style={{
                  width: 44,
                  height: TAB_HEIGHT,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: focused ? tc.activeBg : 'transparent',
                  borderWidth: focused ? 1 : 0,
                  borderColor: focused ? tc.active + '50' : 'transparent',
                  shadowColor: focused ? tc.active : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: focused ? 0.5 : 0,
                  shadowRadius: focused ? 8 : 0,
                  elevation: focused ? 4 : 0,
                }}
              >
                <Feather
                  name={tab.icon}
                  size={focused ? 22 : 20}
                  color={focused ? tc.active : '#30364A'}
                />
                {focused && (
                  <View style={{
                    position: 'absolute',
                    right: -1,
                    top: '50%',
                    marginTop: -10,
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    backgroundColor: tc.active,
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={toggle}
          style={{
            width: 36,
            height: 36,
            borderRadius: 14,
            backgroundColor: expanded ? '#12151E' : focusedTC.activeBg,
            borderWidth: 1,
            borderColor: expanded ? '#1C2030' : focusedTC.active + '50',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: expanded ? 'transparent' : focusedTC.active,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: expanded ? 0 : 0.4,
            shadowRadius: expanded ? 0 : 8,
            elevation: expanded ? 0 : 4,
          }}
        >
          <Animated.View style={{ transform: [{ rotate: toggleRotate }] }}>
            <Feather
              name="chevrons-up"
              size={14}
              color={expanded ? '#4A5070' : focusedTC.active}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {!expanded && focusedTab && (
        <View style={{
          position: 'absolute',
          bottom: -32,
          right: 0,
          backgroundColor: '#0A0C12',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: focusedTC.active + '40',
          paddingVertical: 2,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
          <View style={{
            width: 4, height: 4, borderRadius: 2,
            backgroundColor: focusedTC.active,
          }} />
          <Text style={{
            fontSize: 7,
            fontWeight: '700',
            color: focusedTC.active,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {focusedTab.label}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// ─── Tab configs ──────────────────────────────────────────────────────────────
const PARENT_TABS: TabItem[] = [
  { name: 'Accueil',   label: 'Accueil',   icon: 'home'        },
  { name: 'Enfants',   label: 'Enfants',   icon: 'users'       },
  { name: 'Paiements', label: 'Paiements', icon: 'credit-card' },
  { name: 'Profil',    label: 'Profil',    icon: 'user'        },
];

const STUDENT_TABS: TabItem[] = [
  { name: 'Accueil', label: 'Accueil', icon: 'home'      },
  { name: 'Emploi',  label: 'Emploi',  icon: 'calendar'  },
  { name: 'Notes',   label: 'Notes',   icon: 'book-open' },
  { name: 'Profil',  label: 'Profil',  icon: 'user'      },
];

const TEACHER_TABS: TabItem[] = [
  { name: 'Accueil', label: 'Accueil', icon: 'home'     },
  { name: 'Classes', label: 'Classes', icon: 'users'    },
  { name: 'Emploi',  label: 'Emploi',  icon: 'calendar' },
  { name: 'Profil',  label: 'Profil',  icon: 'user'     },
];

// ─── Tab Navigators ───────────────────────────────────────────────────────────
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();

const ParentTabs = () => (
  <ParentTab.Navigator screenOptions={{ headerShown: false }}
    tabBar={(p) => <CustomTabBar {...p} tabs={PARENT_TABS} />}>
    <ParentTab.Screen name="Accueil"   component={ParentHomeScreen}    />
    <ParentTab.Screen name="Enfants"   component={ChildrenListScreen}  />
    <ParentTab.Screen name="Paiements" component={ParentPaymentsScreen}/>
    <ParentTab.Screen name="Profil"    component={ProfileScreen}       />
  </ParentTab.Navigator>
);

const StudentTabs = () => (
  <StudentTab.Navigator screenOptions={{ headerShown: false }}
    tabBar={(p) => <CustomTabBar {...p} tabs={STUDENT_TABS} />}>
    <StudentTab.Screen name="Accueil" component={StudentHomeScreen}     />
    <StudentTab.Screen name="Emploi"  component={StudentTimetableScreen}/>
    <StudentTab.Screen name="Notes"   component={StudentGradesScreen}   />
    <StudentTab.Screen name="Profil"  component={ProfileScreen}         />
  </StudentTab.Navigator>
);

const TeacherTabs = () => (
  <TeacherTab.Navigator screenOptions={{ headerShown: false }}
    tabBar={(p) => <CustomTabBar {...p} tabs={TEACHER_TABS} />}>
    <TeacherTab.Screen name="Accueil" component={TeacherHomeScreen}     />
    <TeacherTab.Screen name="Classes" component={TeacherClassesScreen}  />
    <TeacherTab.Screen name="Emploi"  component={TeacherTimetableScreen}/>
    <TeacherTab.Screen name="Profil"  component={ProfileScreen}         />
  </TeacherTab.Navigator>
);

// ─── Stack Navigator ──────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();

const slideFromRight = { animation: 'slide_from_right' as const, animationDuration: 260 };
const slideFromBottom = { animation: 'slide_from_bottom' as const, animationDuration: 300 };
const fade = { animation: 'fade' as const, animationDuration: 350 };

export const AppNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAppStore();
  const userRole = user?.role ?? 'PARENT';

  if (isLoading) return <LoadingSpinner fullScreen text="Chargement..." />;

  const MainTabsComponent =
    userRole === 'ELEVE' ? StudentTabs :
    userRole === 'PROFESSEUR' ? TeacherTabs :
    ParentTabs;

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#0E1117' },
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
          
          <Stack.Screen name="Profile" component={ProfileScreen} options={slideFromBottom} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={slideFromBottom} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={slideFromBottom} />
          <Stack.Screen name="About" component={AboutScreen} options={slideFromBottom} />
          
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
        </>
      )}
    </Stack.Navigator>
  );
};