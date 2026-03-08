import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TicketListScreen } from '../screens/tickets/TicketListScreen';
import { TicketDetailScreen } from '../screens/tickets/TicketDetailScreen';
import { CreateTicketScreen } from '../screens/tickets/CreateTicketScreen';
import { useTheme } from '../theme/useTheme';
import { useI18n } from '../i18n';

export type TicketStackParamList = {
  TicketList: undefined;
  TicketDetail: { ticketId: number };
  CreateTicket: undefined;
};

const Stack = createNativeStackNavigator<TicketStackParamList>();

export function TicketStack() {
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
