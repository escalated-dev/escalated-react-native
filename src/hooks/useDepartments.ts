import { useQuery } from '@tanstack/react-query';
import * as apiService from '../services/apiService';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => apiService.getDepartments(),
    select: (data) => data.data,
  });
}
