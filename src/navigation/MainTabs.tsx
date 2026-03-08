import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TicketStack } from './TicketStack';
import { KBStack } from './KBStack';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../theme/useTheme';
import { useI18n } from '../i18n';
import { fontSize } from '../theme/spacing';

export type MainTabsParamList = {
  TicketsTab: undefined;
  KBTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return (
    <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.7 }]}>
      {icon}
    </Text>
  );
}

export function MainTabs() {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="TicketsTab"
        component={TicketStack}
        options={{
          tabBarLabel: t('tickets'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={'\uD83C\uDFF7\uFE0F'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="KBTab"
        component={KBStack}
        options={{
          tabBarLabel: t('knowledge_base'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={'\uD83D\uDCDA'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: t('settings'),
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          tabBarLabel: t('settings'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={'\u2699\uFE0F'} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 22,
  },
});
