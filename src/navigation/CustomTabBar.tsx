// components/navigation/CustomTabBar.tsx
//
// Barre d'onglets flottante : un seul indicateur en dégradé orange→violet
// glisse derrière l'icône active, les libellés n'apparaissent que pour
// l'onglet sélectionné. Pensée pour rester épurée (un seul élément de
// couleur à la fois) tout en étant clairement identifiable comme Zenit.
//
// Utilisation : remplacer `screenOptions={getTabScreenOptions(theme)}`
// par `tabBar={(props) => <CustomTabBar {...props} />}` sur chaque
// <XxxTab.Navigator>. Les icônes viennent toujours de `tabBarIcon` défini
// sur chaque <Tab.Screen>, donc aucun autre changement n'est nécessaire.

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';

const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

const PILL_SIZE = 44;
const BAR_HEIGHT = 60;

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const indicator = useRef(new Animated.Value(0)).current;
  const routeCount = state.routes.length;
  const segmentWidth = containerWidth / routeCount;

  useEffect(() => {
    if (!containerWidth) return;
    Animated.spring(indicator, {
      toValue: state.index * segmentWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    }).start();
  }, [state.index, containerWidth]);

  const onLayout = (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width);

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom > 0 ? insets.bottom - 6 : 12 }]} pointerEvents="box-none">
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
        ]}
        onLayout={onLayout}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.pillWrap,
              {
                width: segmentWidth,
                transform: [{ translateX: indicator }],
              },
            ]}
          >
            <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pill} />
          </Animated.View>
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          const icon = options.tabBarIcon
            ? options.tabBarIcon({
                focused,
                color: focused ? '#FFFFFF' : colors.textMuted,
                size: 19,
              })
            : null;

          return (
            <TabItem
              key={route.key}
              focused={focused}
              label={label}
              icon={icon}
              activeColor={colors.text}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({
  focused,
  label,
  icon,
  activeColor,
  onPress,
  onLongPress,
}: {
  focused: boolean;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: focused ? 1 : 0.9, useNativeDriver: true, damping: 14 }),
      Animated.timing(labelOpacity, { toValue: focused ? 1 : 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View style={[styles.itemInner, { transform: [{ scale }] }]}>
        {icon}
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: activeColor, opacity: labelOpacity, maxWidth: focused ? 90 : 0 },
          ]}
        >
          {focused ? `  ${label}` : ''}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    width: '100%',
    maxWidth: 420,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20 },
      android: { elevation: 8 },
    }),
  },
  pillWrap: {
    position: 'absolute',
    left: 0,
    top: (BAR_HEIGHT - PILL_SIZE) / 2,
    height: PILL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', height: BAR_HEIGHT },
  itemInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12.5, fontWeight: '600', overflow: 'hidden' },
});