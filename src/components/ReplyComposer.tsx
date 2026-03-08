import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import { useI18n } from '../i18n';
import { FilePicker, PickedFile } from './FilePicker';

interface ReplyComposerProps {
  onSend: (body: string, files: PickedFile[]) => void;
  isSending?: boolean;
}

export function ReplyComposer({ onSend, isSending }: ReplyComposerProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleSend = () => {
    if (!body.trim()) return;
    onSend(body.trim(), files);
    setBody('');
    setFiles([]);
    setShowAttachments(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('write_reply')}
        placeholderTextColor={theme.colors.textSecondary}
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setShowAttachments(!showAttachments)}
          activeOpacity={0.7}
        >
          <Text style={[styles.attachIcon, { color: theme.colors.textSecondary }]}>
            {'\ud83d\udcce'}
          </Text>
          <Text style={[styles.attachText, { color: theme.colors.textSecondary }]}>
            {t('attachments')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: body.trim() && !isSending ? 1 : 0.5,
            },
          ]}
          onPress={handleSend}
          disabled={!body.trim() || isSending}
          activeOpacity={0.7}
        >
          <Text style={styles.sendText}>{t('send_reply')}</Text>
        </TouchableOpacity>
      </View>

      {showAttachments && <FilePicker files={files} onFilesChanged={setFiles} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
    minHeight: 100,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 18,
    marginRight: spacing.xxs,
  },
  attachText: {
    fontSize: fontSize.sm,
  },
  sendButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.default,
  },
  sendText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
