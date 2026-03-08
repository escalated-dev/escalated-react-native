import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { spacing, fontSize } from '../../theme/spacing';
import { useI18n } from '../../i18n';
import { useTickets } from '../../hooks/useTickets';
import { TicketFilters, TicketSummary } from '../../types/ticket';
import { TicketCard } from './TicketCard';
import { TicketFilterSheet } from './TicketFilterSheet';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function TicketListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [filters, setFilters] = useState<TicketFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useTickets(filters);

  const tickets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: TicketSummary }) => (
      <TicketCard
        ticket={item}
        onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: TicketSummary) => String(item.id), []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSkeleton lines={3} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.filterButton, { borderColor: theme.colors.border }]}
          onPress={() => setShowFilters(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, { color: theme.colors.textSecondary }]}>
            {t('filter')}
          </Text>
        </TouchableOpacity>
      </View>

      {isError ? (
        <EmptyState title={t('error')} actionLabel={t('retry')} onAction={() => refetch()} />
      ) : tickets.length === 0 ? (
        <EmptyState
          title={t('no_tickets')}
          actionLabel={t('create_ticket')}
          onAction={() => navigation.navigate('CreateTicket')}
        />
      ) : (
        <FlatList
          data={tickets}
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

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateTicket')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TicketFilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: 80,
  },
  loadingMore: {
    textAlign: 'center',
    padding: spacing.md,
    fontSize: fontSize.sm,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 30,
  },
});
