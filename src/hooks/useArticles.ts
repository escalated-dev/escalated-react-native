import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import * as apiService from '../services/apiService';
import { ArticleFilters } from '../types/article';

export function useArticles(filters: ArticleFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['articles', filters],
    queryFn: ({ pageParam = 1 }) =>
      apiService.getArticles({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => apiService.getArticle(id),
    select: (data) => data.data,
    enabled: id > 0,
  });
}

export function useArticleFeedback(articleId: number) {
  return useMutation({
    mutationFn: (helpful: boolean) => apiService.submitArticleFeedback(articleId, helpful),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    select: (data) => data.data,
  });
}
