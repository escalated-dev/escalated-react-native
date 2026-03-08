import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useAuthContext } from '../../hooks/useAuth';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { registerMutation } = useAuthContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) return;
    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: confirmPassword,
    });
  };

  const errorMessage = registerMutation.error
    ? (registerMutation.error as any)?.response?.data?.message || t('error')
    : null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.colors.primary }]}>Escalated</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('register')}
          </Text>
        </View>

        {errorMessage && (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.error + '1A' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('name')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('name')}
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('email')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('email')}
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('password')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('password')}
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            {t('confirm_password')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('confirm_password')}
            placeholderTextColor={theme.colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                opacity: registerMutation.isPending ? 0.7 : 1,
              },
            ]}
            onPress={handleRegister}
            disabled={registerMutation.isPending}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {registerMutation.isPending ? t('loading') : t('create_account')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
              {t('already_have_account')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
  },
  errorBox: {
    padding: spacing.sm,
    borderRadius: borderRadius.default,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  linkText: {
    fontSize: fontSize.md,
  },
});
