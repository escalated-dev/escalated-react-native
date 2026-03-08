import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import { useI18n } from '../i18n';
import { Attachment } from '../types/reply';

interface AttachmentListProps {
  attachments: Attachment[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '\ud83d\uddbc';
  if (mimeType.startsWith('video/')) return '\ud83c\udfa5';
  if (mimeType.startsWith('audio/')) return '\ud83c\udfa7';
  if (mimeType.includes('pdf')) return '\ud83d\udcc4';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '\ud83d\udce6';
  return '\ud83d\udcc1';
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  const { theme } = useTheme();
  const { t } = useI18n();

  if (!attachments.length) return null;

  const handleDownload = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
        {t('attachments')} ({attachments.length})
      </Text>
      {attachments.map((attachment) => (
        <TouchableOpacity
          key={attachment.id}
          style={[
            styles.item,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
          ]}
          onPress={() => handleDownload(attachment.url)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{getFileIcon(attachment.mime_type)}</Text>
          <View style={styles.info}>
            <Text style={[styles.filename, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {attachment.filename}
            </Text>
            <Text style={[styles.size, { color: theme.colors.textSecondary }]}>
              {formatFileSize(attachment.size)}
            </Text>
          </View>
          <Text style={[styles.downloadText, { color: theme.colors.primary }]}>
            {t('download')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    marginBottom: spacing.xxs,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  info: {
    flex: 1,
  },
  filename: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  size: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  downloadText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
