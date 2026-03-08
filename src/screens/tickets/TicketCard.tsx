import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { TicketSummary } from '../../types/ticket';

interface TicketCardProps {
  ticket: TicketSummary;
  onPress: () => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.reference, { color: theme.colors.textSecondary }]}>
          {ticket.reference}
        </Text>
        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
          {timeAgo(ticket.updated_at)}
        </Text>
      </View>

      <Text style={[styles.subject, { color: theme.colors.textPrimary }]} numberOfLines={2}>
        {ticket.subject}
      </Text>

      <View style={styles.badges}>
        <StatusBadge status={ticket.status} label={ticket.status_label} />
        <View style={styles.badgeSpacer} />
        <PriorityBadge priority={ticket.priority} label={ticket.priority_label} />
      </View>

      {ticket.department && (
        <Text style={[styles.department, { color: theme.colors.textSecondary }]}>
          {ticket.department.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  reference: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  time: {
    fontSize: fontSize.xs,
  },
  subject: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSpacer: {
    width: spacing.xs,
  },
  department: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});
