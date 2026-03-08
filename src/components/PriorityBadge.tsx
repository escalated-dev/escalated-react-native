import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, fontSize, spacing } from '../theme/spacing';
import { useI18n, TranslationKeys } from '../i18n';
import { PriorityValue } from '../types/common';

interface PriorityBadgeProps {
  priority: PriorityValue;
  label?: string;
}

export function PriorityBadge({ priority, label }: PriorityBadgeProps) {
  const { t } = useI18n();
  const color = colors.priority[priority] || colors.priority.medium;
  const displayLabel = label || t(priority as TranslationKeys);

  return (
    <View style={[styles.badge, { backgroundColor: color + '1A', borderColor: color + '33' }]}>
      <Text style={[styles.text, { color }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
