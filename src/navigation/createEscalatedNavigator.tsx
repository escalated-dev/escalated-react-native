import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { useI18n } from '../i18n';
import { fontSize } from '../theme/spacing';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { TicketListScreen } from '../screens/tickets/TicketListScreen';
import { TicketDetailScreen } from '../screens/tickets/TicketDetailScreen';
import { CreateTicketScreen } from '../screens/tickets/CreateTicketScreen';
import { KBListScreen } from '../screens/kb/KBListScreen';
import { KBArticleScreen } from '../screens/kb/KBArticleScreen';
import { GuestCreateScreen } from '../screens/guest/GuestCreateScreen';
import { GuestTicketScreen } from '../screens/guest/GuestTicketScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

// Param Lists
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TicketStackParamList = {
  TicketList: undefined;
  TicketDetail: { ticketId: number };
  CreateTicket: undefined;
};

export type KBStackParamList = {
  KBList: undefined;
  KBArticle: { articleId: number };
};

export type GuestStackParamList = {
  GuestCreate: undefined;
  GuestTicket: { reference: string; email: string };
};

export type MainTabsParamList = {
  TicketsTab: undefined;
  KBTab: undefined;
  SettingsTab: undefined;
};

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return (
    <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.7 }]}>
      {icon}
    </Text>
  );
}

function TicketStackNavigator() {
  const Stack = createNativeStackNavigator<TicketStackParamList>();
  const { theme } = useTheme();
  const { t } = useI18n();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.textPrimary,
    headerTitleStyle: { fontWeight: '600' },
    contentStyle: { backgroundColor: theme.colors.background },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="TicketList"
        component={TicketListScreen}
        options={{ title: t('tickets') }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ title: t('details') }}
      />
      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
        options={{ title: t('new_ticket') }}
      />
    </Stack.Navigator>
  );
}

function KBStackNavigator() {
  const Stack = createNativeStackNavigator<KBStackParamList>();
  const { theme } = useTheme();
  const { t } = useI18n();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.textPrimary,
    headerTitleStyle: { fontWeight: '600' },
    contentStyle: { backgroundColor: theme.colors.background },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="KBList"
        component={KBListScreen}
        options={{ title: t('knowledge_base') }}
      />
      <Stack.Screen
        name="KBArticle"
        component={KBArticleScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Creates a pre-configured tab navigator with all Escalated screens.
 * Consumers can use this directly or wire individual screens themselves.
 *
 * Usage:
 * ```tsx
 * const EscalatedTabs = createEscalatedTabs();
 * // Then in your navigator: <EscalatedTabs />
 * ```
 */
export function createEscalatedTabs() {
  const Tab = createBottomTabNavigator<MainTabsParamList>();

  return function EscalatedTabs() {
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
          component={TicketStackNavigator}
          options={{
            tabBarLabel: t('tickets'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon={'\uD83C\uDFF7\uFE0F'} focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="KBTab"
          component={KBStackNavigator}
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
  };
}

/**
 * Creates a pre-configured auth stack navigator (Login + Register).
 */
export function createAuthStack() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();

  return function AuthStack() {
    const { theme } = useTheme();

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  };
}

/**
 * Creates a pre-configured guest stack navigator (GuestCreate + GuestTicket).
 */
export function createGuestStack() {
  const Stack = createNativeStackNavigator<GuestStackParamList>();

  return function GuestStack() {
    const { theme } = useTheme();
    const { t } = useI18n();

    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="GuestCreate"
          component={GuestCreateScreen}
          options={{ title: t('submit_ticket') }}
        />
        <Stack.Screen
          name="GuestTicket"
          component={GuestTicketScreen}
          options={{ title: t('details') }}
        />
      </Stack.Navigator>
    );
  };
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 22,
  },
});
