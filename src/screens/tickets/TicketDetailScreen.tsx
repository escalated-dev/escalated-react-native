import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useTicket } from '../../hooks/useTickets';
import { useReplyTicket, useCloseTicket, useReopenTicket, useRateTicket } from '../../hooks/useReplyTicket';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { SlaTimer } from '../../components/SlaTimer';
import { ReplyThread } from '../../components/ReplyThread';
import { ReplyComposer } from '../../components/ReplyComposer';
import { SatisfactionRating } from '../../components/SatisfactionRating';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { PickedFile } from '../../components/FilePicker';

type TicketStackParamList = {
  TicketList: undefined;
  TicketDetail: { ticketId: number };
  CreateTicket: undefined;
};

type Props = NativeStackScreenProps<TicketStackParamList, 'TicketDetail'>;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TicketDetailScreen({ route }: Props) {
  const { ticketId } = route.params;
  const { theme } = useTheme();
  const { t } = useI18n();
  const { width } = useWindowDimensions();

  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId);
  const replyMutation = useReplyTicket(ticketId);
  const closeMutation = useCloseTicket(ticketId);
  const reopenMutation = useReopenTicket(ticketId);
  const rateMutation = useRateTicket(ticketId);

  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleSendReply = (body: string, files: PickedFile[]) => {
    replyMutation.mutate({
      body,
      attachments: files.length > 0 ? files : undefined,
    });
  };

  const handleClose = () => {
    Alert.alert(t('close_ticket'), t('close_ticket') + '?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('close_ticket'), style: 'destructive', onPress: () => closeMutation.mutate() },
    ]);
  };

  const handleReopen = () => {
    reopenMutation.mutate();
  };

  const handleRate = (rating: number, comment?: string) => {
    rateMutation.mutate(
      { rating, comment },
      { onSuccess: () => setRatingSubmitted(true) }
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSkeleton lines={4} showAvatar />
      </View>
    );
  }

  if (isError || !ticket) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState title={t('error')} actionLabel={t('retry')} onAction={() => refetch()} />
      </View>
    );
  }

  const isResolved = ticket.status.value === 'resolved';
  const isClosed = ticket.status.value === 'closed';
  const canClose = !isClosed && !isResolved;
  const canReopen = isClosed || isResolved;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.subject, { color: theme.colors.textPrimary }]}>
            {ticket.subject}
          </Text>
          <Text style={[styles.reference, { color: theme.colors.textSecondary }]}>
            {ticket.reference}
          </Text>

          <View style={styles.badgeRow}>
            <StatusBadge status={ticket.status.value} label={ticket.status.label} />
            <PriorityBadge priority={ticket.priority.value} label={ticket.priority.label} />
          </View>

          {ticket.department && (
            <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
              {t('department')}: {ticket.department.name}
            </Text>
          )}

          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {t('created')}: {formatDate(ticket.created_at)}
          </Text>

          {ticket.requester && (
            <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
              {t('requester')}: {ticket.requester.name}
            </Text>
          )}
        </View>

        {/* SLA Timers */}
        {ticket.sla && (
          <View style={styles.slaSection}>
            <SlaTimer
              dueAt={ticket.sla.first_response_due_at}
              breached={ticket.sla.first_response_breached}
              label={t('first_response')}
            />
            <SlaTimer
              dueAt={ticket.sla.resolution_due_at}
              breached={ticket.sla.resolution_breached}
              label={t('resolution')}
            />
          </View>
        )}

        {/* Description */}
        <View style={[styles.descriptionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {t('description')}
          </Text>
          <RenderHtml
            contentWidth={width - spacing.md * 4}
            source={{ html: ticket.description }}
            baseStyle={{
              color: theme.colors.textPrimary,
              fontSize: fontSize.md,
              lineHeight: 22,
            }}
            tagsStyles={{
              p: { marginBottom: 8 },
              a: { color: theme.colors.primary },
            }}
          />
        </View>

        {/* Replies */}
        {ticket.replies.length > 0 && (
          <View style={styles.repliesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {t('reply')} ({ticket.replies.filter((r) => !r.is_internal_note).length})
            </Text>
            <ReplyThread replies={ticket.replies} />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {canClose && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.error + '1A', borderColor: theme.colors.error + '33' }]}
              onPress={handleClose}
              disabled={closeMutation.isPending}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
                {closeMutation.isPending ? t('loading') : t('close_ticket')}
              </Text>
            </TouchableOpacity>
          )}
          {canReopen && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.success + '1A', borderColor: theme.colors.success + '33' }]}
              onPress={handleReopen}
              disabled={reopenMutation.isPending}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.success }]}>
                {reopenMutation.isPending ? t('loading') : t('reopen_ticket')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Satisfaction Rating when resolved */}
        {isResolved && (
          <SatisfactionRating
            onSubmit={handleRate}
            isSubmitting={rateMutation.isPending}
            submitted={ratingSubmitted}
          />
        )}
      </ScrollView>

      {/* Reply Composer pinned to bottom */}
      {!isClosed && (
        <ReplyComposer
          onSend={handleSendReply}
          isSending={replyMutation.isPending}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  subject: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  reference: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xxs,
  },
  slaSection: {
    marginBottom: spacing.sm,
  },
  descriptionCard: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  repliesSection: {
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
