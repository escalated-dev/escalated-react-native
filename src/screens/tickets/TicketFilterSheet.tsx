import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n, TranslationKeys } from '../../i18n';
import { StatusValue, PriorityValue } from '../../types/common';
import { TicketFilters } from '../../types/ticket';

interface TicketFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: TicketFilters;
  onApply: (filters: TicketFilters) => void;
}

const statuses: (StatusValue | '')[] = [
  '',
  'open',
  'in_progress',
  'waiting_on_customer',
  'waiting_on_agent',
  'escalated',
  'resolved',
  'closed',
  'reopened',
];

const priorities: (PriorityValue | '')[] = ['', 'low', 'medium', 'high', 'urgent', 'critical'];

export function TicketFilterSheet({ visible, onClose, filters, onApply }: TicketFilterSheetProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState<StatusValue | ''>(filters.status || '');
  const [priority, setPriority] = useState<PriorityValue | ''>(filters.priority || '');

  const handleApply = () => {
    onApply({
      search: search.trim() || undefined,
      status: status || undefined,
      priority: priority || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    onApply({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
              {t('filter')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>
                {'\u2715'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sheetBody}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              {t('search_tickets')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder={t('search_tickets')}
              placeholderTextColor={theme.colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />

            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{t('status')}</Text>
            <View style={styles.chipRow}>
              {statuses.map((s) => {
                const isSelected = s === status;
                const label = s ? t(s as TranslationKeys) : t('all_statuses');
                return (
                  <TouchableOpacity
                    key={s || 'all-status'}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                    onPress={() => setStatus(s as StatusValue | '')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              {t('priority')}
            </Text>
            <View style={styles.chipRow}>
              {priorities.map((p) => {
                const isSelected = p === priority;
                const label = p ? t(p as TranslationKeys) : t('all_priorities');
                return (
                  <TouchableOpacity
                    key={p || 'all-priority'}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                    onPress={() => setPriority(p as PriorityValue | '')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.colors.border }]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={[styles.resetText, { color: theme.colors.textSecondary }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleApply}
              activeOpacity={0.7}
            >
              <Text style={styles.applyText}>{t('filter')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sheetTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 20,
    padding: spacing.xxs,
  },
  sheetBody: {
    padding: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
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
    marginBottom: spacing.xxs,
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  sheetFooter: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  resetButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    alignItems: 'center',
  },
  applyText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
