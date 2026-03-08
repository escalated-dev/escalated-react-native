import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useArticle, useArticleFeedback } from '../../hooks/useArticles';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';

type KBStackParamList = {
  KBList: undefined;
  KBArticle: { articleId: number };
};

type Props = NativeStackScreenProps<KBStackParamList, 'KBArticle'>;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function KBArticleScreen({ route, navigation }: Props) {
  const { articleId } = route.params;
  const { theme } = useTheme();
  const { t } = useI18n();
  const { width } = useWindowDimensions();

  const { data: article, isLoading, isError, refetch } = useArticle(articleId);
  const feedbackMutation = useArticleFeedback(articleId);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    feedbackMutation.mutate(helpful, {
      onSuccess: () => setFeedbackGiven(true),
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSkeleton lines={5} />
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState title={t('error')} actionLabel={t('retry')} onAction={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Title & Meta */}
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {article.title}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
          {t('published')}: {formatDate(article.published_at)}
        </Text>
        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
          {article.views_count} {t('views')}
        </Text>
      </View>

      {article.category && (
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '1A' }]}>
          <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
            {article.category.name}
          </Text>
        </View>
      )}

      {/* Article Body */}
      <View style={[styles.bodyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <RenderHtml
          contentWidth={width - spacing.md * 4}
          source={{ html: article.body }}
          baseStyle={{
            color: theme.colors.textPrimary,
            fontSize: fontSize.md,
            lineHeight: 24,
          }}
          tagsStyles={{
            p: { marginBottom: 12 },
            a: { color: theme.colors.primary },
            h1: { fontSize: fontSize.xxl, fontWeight: '700', marginBottom: 12, color: theme.colors.textPrimary },
            h2: { fontSize: fontSize.xl, fontWeight: '600', marginBottom: 10, color: theme.colors.textPrimary },
            h3: { fontSize: fontSize.lg, fontWeight: '600', marginBottom: 8, color: theme.colors.textPrimary },
            ul: { marginBottom: 12 },
            ol: { marginBottom: 12 },
            li: { marginBottom: 4 },
            code: { backgroundColor: theme.colors.border, paddingHorizontal: 4, borderRadius: 4 },
            pre: { backgroundColor: theme.colors.border, padding: 12, borderRadius: 8, marginBottom: 12 },
            blockquote: { borderLeftWidth: 3, borderLeftColor: theme.colors.primary, paddingLeft: 12, marginBottom: 12, fontStyle: 'italic' },
          }}
        />
      </View>

      {/* Helpful / Not Helpful */}
      <View style={[styles.feedbackCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {feedbackGiven ? (
          <Text style={[styles.feedbackThankYou, { color: theme.colors.success }]}>
            {t('thank_you_feedback')}
          </Text>
        ) : (
          <>
            <Text style={[styles.feedbackTitle, { color: theme.colors.textPrimary }]}>
              {t('was_article_helpful')}
            </Text>
            <View style={styles.feedbackButtonRow}>
              <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: theme.colors.success + '1A', borderColor: theme.colors.success + '33' }]}
                onPress={() => handleFeedback(true)}
                disabled={feedbackMutation.isPending}
                activeOpacity={0.7}
              >
                <Text style={[styles.feedbackButtonText, { color: theme.colors.success }]}>
                  {t('helpful')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: theme.colors.error + '1A', borderColor: theme.colors.error + '33' }]}
                onPress={() => handleFeedback(false)}
                disabled={feedbackMutation.isPending}
                activeOpacity={0.7}
              >
                <Text style={[styles.feedbackButtonText, { color: theme.colors.error }]}>
                  {t('not_helpful')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Related Articles */}
      {article.related_articles.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {t('related_articles')}
          </Text>
          {article.related_articles.map((related) => (
            <TouchableOpacity
              key={related.id}
              style={[
                styles.relatedCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => navigation.push('KBArticle', { articleId: related.id })}
              activeOpacity={0.7}
            >
              <Text style={[styles.relatedTitle, { color: theme.colors.primary }]}>
                {related.title}
              </Text>
              {related.excerpt && (
                <Text
                  style={[styles.relatedExcerpt, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {related.excerpt}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.badge,
    marginBottom: spacing.md,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bodyCard: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  feedbackCard: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  feedbackButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feedbackButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.default,
    borderWidth: 1,
  },
  feedbackButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  feedbackThankYou: {
    fontSize: fontSize.md,
    fontWeight: '600',
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  relatedSection: {
    marginTop: spacing.xs,
  },
  relatedCard: {
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  relatedTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  relatedExcerpt: {
    fontSize: fontSize.sm,
  },
});
