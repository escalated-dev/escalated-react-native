import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import { useI18n } from '../i18n';

export interface PickedFile {
  uri: string;
  name: string;
  type: string;
}

interface FilePickerProps {
  files: PickedFile[];
  onFilesChanged: (files: PickedFile[]) => void;
  maxFiles?: number;
}

export function FilePicker({ files, onFilesChanged, maxFiles = 5 }: FilePickerProps) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: PickedFile[] = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
        }));
        const merged = [...files, ...newFiles].slice(0, maxFiles);
        onFilesChanged(merged);
      }
    } catch {
      // User cancelled or error
    }
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChanged(updated);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.pickButton,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
          },
        ]}
        onPress={handlePick}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickIcon, { color: theme.colors.textSecondary }]}>+</Text>
        <Text style={[styles.pickText, { color: theme.colors.textSecondary }]}>
          {t('drop_or_browse')}
        </Text>
      </TouchableOpacity>

      {files.map((file, index) => (
        <View
          key={`${file.name}-${index}`}
          style={[
            styles.fileItem,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.fileName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {file.name}
          </Text>
          <TouchableOpacity onPress={() => handleRemove(index)}>
            <Text style={[styles.removeText, { color: theme.colors.error }]}>{t('remove')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pickIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: spacing.xs,
  },
  pickText: {
    fontSize: fontSize.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xs,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  fileName: {
    flex: 1,
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  removeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
