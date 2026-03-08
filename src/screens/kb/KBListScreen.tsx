import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { spacing, borderRadius, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useArticles, useCategories } from '../../hooks/useArticles';
import { ArticleSummary } from '../../types/article';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

type KBStackParamList = {
  KBList: undefined;
  KBArticle: { articleId: number };
};

type Props = {
  navigation: NativeStackNavigationProp<KBStackParamList, 'KBList'>;
};

export function KBListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 400);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchText]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category_id: selectedCategoryId,
    }),
    [debouncedSearch, selectedCategoryId]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useArticles(filters);
  const { data: categories } = useCategories();

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: ArticleSummary }) => (
      <TouchableOpacity
        style={[
          styles.articleCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => navigation.navigate('KBArticle', { articleId: item.id })}
        activeOpacity={0.7}
      >
        {item.category && (
          <Text style={[styles.categoryLabel, { color: theme.colors.primary }]}>
            {item.category.name}
          </Text>
        )}
        <Text style={[styles.articleTitle, { color: theme.colors.textPrimary }]}>
          {item.title}
        </Text>
        {item.excerpt && (
          <Text
            style={[styles.articleExcerpt, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.excerpt}
          </Text>
        )}
        <Text style={[styles.viewCount, { color: theme.colors.textSecondary }]}>
          {item.views_count} {t('views')}
        </Text>
      </TouchableOpacity>
    ),
    [navigation, theme, t]
  );

  const keyExtractor = useCallback((item: ArticleSummary) => String(item.id), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { borderBottomColor: theme.colors.border }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder={t('search_articles')}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* Category Filter Chips */}
      {categories && categories.length > 0 && (
        <View style={[styles.chipContainer, { borderBottomColor: theme.colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor: !selectedCategoryId ? theme.colors.primary : theme.colors.surface,
                  borderColor: !selectedCategoryId ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategoryId(undefined)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: !selectedCategoryId ? '#ffffff' : theme.colors.textPrimary },
                ]}
              >
                {t('all')}
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategoryId(isSelected ? undefined : cat.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? '#ffffff' : theme.colors.textPrimary },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Article List */}
      {isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : isError ? (
        <EmptyState title={t('error')} actionLabel={t('retry')} onAction={() => refetch()} />
      ) : articles.length === 0 ? (
        <EmptyState title={t('no_articles')} />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshing={false}
          onRefresh={() => refetch()}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Text style={[styles.loadingMore, { color: theme.colors.textSecondary }]}>
                {t('loading')}
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: borderRadius.default,
    padding: spacing.sm,
    fontSize: fontSize.md,
  },
  chipContainer: {
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  chipScroll: {
    paddingHorizontal: spacing.sm,
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
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  articleCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: spacing.xxs,
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  articleExcerpt: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  viewCount: {
    fontSize: fontSize.xs,
  },
  loadingMore: {
    textAlign: 'center',
    padding: spacing.md,
    fontSize: fontSize.sm,
  },
});
