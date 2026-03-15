import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n, Locale, localeLabels } from '../../i18n';
import { useAuthContext } from '../../hooks/useAuth';

const availableLocales: Locale[] = ['en', 'es', 'fr', 'de'];

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuthContext();

  const isDark = theme.mode === 'dark';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* User Info */}
      {user && (
        <View
          style={[
            styles.userCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user.name}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
              {user.email}
            </Text>
          </View>
        </View>
      )}

      {/* Theme Toggle */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('settings')}
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Text style={[styles.settingIcon, { color: theme.colors.textPrimary }]}>
              {isDark ? '\u{1F31C}' : '\u{2600}\u{FE0F}'}
            </Text>
            <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>
              {isDark ? t('dark_mode') : t('light_mode')}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={isDark ? theme.colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language Picker */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {t('language')}
        </Text>
        <View style={styles.languageRow}>
          {availableLocales.map((loc) => {
            const isSelected = loc === locale;
            return (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.languageChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.background,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
                onPress={() => setLocale(loc)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                  ]}
                >
                  {localeLabels[loc]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout Button */}
      {user && (
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: theme.colors.error + '1A', borderColor: theme.colors.error + '33' },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Powered by Escalated */}
      <View style={styles.poweredByContainer}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://escalated.dev');
          }}
          activeOpacity={0.7}
          style={styles.poweredByLink}
        >
          <Text style={[styles.poweredByText, { color: theme.colors.textSecondary }]}>
            Powered by Escalated
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  userEmail: {
    fontSize: fontSize.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  settingText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  languageChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.badge,
    borderWidth: 1,
  },
  languageChipText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  poweredByContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  poweredByLink: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  poweredByText: {
    fontSize: 11,
    fontWeight: '400',
  },
});
