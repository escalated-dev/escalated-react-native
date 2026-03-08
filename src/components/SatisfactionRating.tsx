import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { colors } from '../theme/colors';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import { useI18n, TranslationKeys } from '../i18n';

interface SatisfactionRatingProps {
  onSubmit: (rating: number, comment?: string) => void;
  isSubmitting?: boolean;
  submitted?: boolean;
}

const ratingLabels: TranslationKeys[] = ['terrible', 'poor', 'okay', 'good', 'excellent'];

export function SatisfactionRating({ onSubmit, isSubmitting, submitted }: SatisfactionRatingProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.thankYou, { color: theme.colors.success }]}>
          {t('thank_you_feedback')}
        </Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment || undefined);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {t('how_was_experience')}
      </Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
            <Text style={[styles.star, { color: star <= rating ? colors.rating.star : colors.rating.starEmpty }]}>
              {star <= rating ? '\u2605' : '\u2606'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
          {t(ratingLabels[rating - 1])}
        </Text>
      )}

      <TextInput
        style={[
          styles.commentInput,
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('write_reply')}
        placeholderTextColor={theme.colors.textSecondary}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary, opacity: rating > 0 ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        activeOpacity={0.7}
      >
        <Text style={styles.submitText}>{t('submit_rating')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  star: {
    fontSize: 36,
    marginHorizontal: spacing.xxs,
  },
  ratingLabel: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  submitButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.default,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  thankYou: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
