import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as apiService from '../../services/apiService';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { SlaTimer } from '../../components/SlaTimer';
import { ReplyThread } from '../../components/ReplyThread';
import { ReplyComposer } from '../../components/ReplyComposer';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { PickedFile } from '../../components/FilePicker';

type GuestStackParamList = {
  GuestCreate: undefined;
  GuestTicket: { reference: string; email: string };
};

type Props = NativeStackScreenProps<GuestStackParamList, 'GuestTicket'>;

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

export function GuestTicketScreen({ route }: Props) {
  const { reference, email } = route.params;
  const { theme } = useTheme();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, isError, refetch } = useQuery({
    queryKey: ['guestTicket', reference, email],
    queryFn: async () => {
      const result = await apiService.guestGetTicket(reference, email);
      return result.data;
    },
  });

  const replyMutation = useMutation({
    mutationFn: (body: string) =>
      apiService.guestReplyToTicket(reference, email, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestTicket', reference, email] });
    },
  });

  const handleSendReply = (body: string, _files: PickedFile[]) => {
    replyMutation.mutate(body);
  };

  const handleCopyLink = async () => {
    try {
      const link = `Reference: ${reference} | Email: ${email}`;
      await Share.share({ message: link });
    } catch {
      Alert.alert(t('error'), 'Could not share ticket details.');
    }
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

  const isClosed = ticket.status.value === 'closed';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bookmark Notice */}
        <View style={[styles.noticeCard, { backgroundColor: theme.colors.warning + '1A', borderColor: theme.colors.warning + '33' }]}>
          <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>
            {t('bookmark_notice')}
          </Text>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCopyLink}
            activeOpacity={0.7}
          >
            <Text style={styles.copyButtonText}>
              {t('copy_link')}
            </Text>
          </TouchableOpacity>
        </View>

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
      </ScrollView>

      {/* Reply Composer */}
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
  noticeCard: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  copyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.default,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '600',
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
});
