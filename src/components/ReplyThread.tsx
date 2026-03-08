import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import { Reply } from '../types/reply';
import { AttachmentList } from './AttachmentList';

interface ReplyThreadProps {
  replies: Reply[];
}

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

function ReplyItem({ reply }: { reply: Reply }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        styles.replyItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.replyHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>
            {reply.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.authorName, { color: theme.colors.textPrimary }]}>
            {reply.author.name}
          </Text>
          <Text style={[styles.replyDate, { color: theme.colors.textSecondary }]}>
            {formatDate(reply.created_at)}
          </Text>
        </View>
      </View>

      <View style={styles.replyBody}>
        <RenderHtml
          contentWidth={width - 80}
          source={{ html: reply.body }}
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

      {reply.attachments.length > 0 && (
        <AttachmentList attachments={reply.attachments} />
      )}
    </View>
  );
}

export function ReplyThread({ replies }: ReplyThreadProps) {
  return (
    <View style={styles.container}>
      {replies
        .filter((r) => !r.is_internal_note)
        .map((reply) => (
          <ReplyItem key={reply.id} reply={reply} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  replyItem: {
    borderWidth: 1,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  replyDate: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  replyBody: {
    marginLeft: 0,
  },
});
