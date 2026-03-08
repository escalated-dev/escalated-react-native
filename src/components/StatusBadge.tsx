import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, fontSize, spacing } from '../theme/spacing';
import { useI18n, TranslationKeys } from '../i18n';
import { StatusValue } from '../types/common';

interface StatusBadgeProps {
  status: StatusValue;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { t } = useI18n();
  const color = colors.status[status] || colors.status.open;
  const displayLabel = label || t(status as TranslationKeys);

  return (
    <View style={[styles.badge, { backgroundColor: color + '1A' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.badge,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xxs,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
