import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KBListScreen } from '../screens/kb/KBListScreen';
import { KBArticleScreen } from '../screens/kb/KBArticleScreen';
import { useTheme } from '../theme/useTheme';
import { useI18n } from '../i18n';

export type KBStackParamList = {
  KBList: undefined;
  KBArticle: { articleId: number };
};

const Stack = createNativeStackNavigator<KBStackParamList>();

export function KBStack() {
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
