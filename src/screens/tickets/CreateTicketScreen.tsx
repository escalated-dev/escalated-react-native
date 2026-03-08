import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n, TranslationKeys } from '../../i18n';
import { useCreateTicket } from '../../hooks/useCreateTicket';
import { useDepartments } from '../../hooks/useDepartments';
import { PriorityValue } from '../../types/common';
import { FilePicker, PickedFile } from '../../components/FilePicker';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const priorityOptions: PriorityValue[] = ['low', 'medium', 'high', 'urgent', 'critical'];

export function CreateTicketScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const createTicket = useCreateTicket();
  const { data: departments } = useDepartments();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityValue>('medium');
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [files, setFiles] = useState<PickedFile[]>([]);

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert(t('error'), 'Subject and description are required.');
      return;
    }
    createTicket.mutate(
      {
        subject: subject.trim(),
        description: description.trim(),
        priority,
        department_id: departmentId,
        attachments: files,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  const errorMessage = createTicket.error
    ? (createTicket.error as any)?.response?.data?.message || t('error')
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {errorMessage && (
        <View style={[styles.errorBox, { backgroundColor: theme.colors.error + '1A' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
        </View>
      )}

      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('subject')}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('subject')}
        placeholderTextColor={theme.colors.textSecondary}
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('description')}</Text>
      <TextInput
        style={[
          styles.textArea,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('description')}
        placeholderTextColor={theme.colors.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('priority')}</Text>
      <View style={styles.chipRow}>
        {priorityOptions.map((p) => {
          const isSelected = p === priority;
          return (
            <TouchableOpacity
              key={p}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setPriority(p)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                ]}
              >
                {t(p as TranslationKeys)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('department')}</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: !departmentId ? theme.colors.primary : theme.colors.surface,
              borderColor: !departmentId ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setDepartmentId(undefined)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              { color: !departmentId ? '#ffffff' : theme.colors.textPrimary },
            ]}
          >
            --
          </Text>
        </TouchableOpacity>
        {(departments || []).map((dept) => {
          const isSelected = dept.id === departmentId;
          return (
            <TouchableOpacity
              key={dept.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setDepartmentId(dept.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                ]}
              >
                {dept.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('attachments')}</Text>
      <FilePicker files={files} onFilesChanged={setFiles} />

      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: theme.colors.primary,
            opacity: createTicket.isPending ? 0.7 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={createTicket.isPending}
        activeOpacity={0.7}
      >
        <Text style={styles.submitText}>
          {createTicket.isPending ? t('loading') : t('create_ticket')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  errorBox: {
    padding: spacing.sm,
    borderRadius: borderRadius.default,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xxs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
    minHeight: 120,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.badge,
    borderWidth: 1,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  submitText: {
    color: '#ffffff',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
