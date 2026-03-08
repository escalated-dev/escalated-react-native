/**
 * Example app demonstrating how to integrate the Escalated React Native library.
 *
 * Install the library:
 *   npm install @escalated-dev/escalated-react-native
 *
 * Then wrap your app with EscalatedProvider and wire in the screens.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  EscalatedProvider,
  useAuthContext,
  createEscalatedTabs,
  createAuthStack,
  createGuestStack,
} from '@escalated-dev/escalated-react-native';

const RootStack = createNativeStackNavigator();
const EscalatedTabs = createEscalatedTabs();
const AuthStack = createAuthStack();
const GuestStack = createGuestStack();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={EscalatedTabs} />
      ) : (
        <>
          <RootStack.Screen name="Auth" component={AuthStack} />
          <RootStack.Screen name="Guest" component={GuestStack} />
        </>
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <EscalatedProvider
      config={{
        apiBaseUrl: 'https://your-domain.com/support/api/v1',
        defaultLocale: 'en',
        darkMode: false,
      }}
    >
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </EscalatedProvider>
  );
}
