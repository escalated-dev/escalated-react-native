import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as apiService from '../services/apiService';
import { TicketFilters } from '../types/ticket';

export function useTickets(filters: TicketFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['tickets', filters],
    queryFn: ({ pageParam = 1 }) =>
      apiService.getTickets({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => apiService.getTicket(id),
    select: (data) => data.data,
    enabled: id > 0,
  });
}
