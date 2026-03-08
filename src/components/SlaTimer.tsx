import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, fontSize, spacing } from '../theme/spacing';
import { useI18n } from '../i18n';

interface SlaTimerProps {
  dueAt: string | null;
  breached: boolean;
  label: string;
}

function getTimeRemaining(dueAt: string): { totalMinutes: number; hours: number; minutes: number } {
  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;
  return { totalMinutes, hours, minutes };
}

function getColor(totalMinutes: number, breached: boolean): string {
  if (breached || totalMinutes < 0) return colors.sla.breached;
  if (totalMinutes < 120) return colors.sla.warning;
  return colors.sla.ok;
}

export function SlaTimer({ dueAt, breached, label }: SlaTimerProps) {
  const { t } = useI18n();
  const [timeInfo, setTimeInfo] = useState(() =>
    dueAt ? getTimeRemaining(dueAt) : null
  );

  useEffect(() => {
    if (!dueAt) return;
    setTimeInfo(getTimeRemaining(dueAt));
    const interval = setInterval(() => {
      setTimeInfo(getTimeRemaining(dueAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [dueAt]);

  if (!dueAt || !timeInfo) return null;

  const color = getColor(timeInfo.totalMinutes, breached);
  const isOverdue = timeInfo.totalMinutes < 0 || breached;

  return (
    <View style={[styles.container, { backgroundColor: color + '1A', borderColor: color + '33' }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      {isOverdue ? (
        <Text style={[styles.value, { color }]}>{t('overdue')}</Text>
      ) : (
        <Text style={[styles.value, { color }]}>
          {t('due_in')} {timeInfo.hours > 0 ? `${timeInfo.hours} ${t('hours')} ` : ''}
          {timeInfo.minutes} {t('minutes')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  value: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
