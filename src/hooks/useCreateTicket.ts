import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as apiService from '../services/apiService';
import { CreateTicketRequest } from '../types/ticket';

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateTicketRequest) => apiService.createTicket(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useGuestCreateTicket() {
  return useMutation({
    mutationFn: (data: CreateTicketRequest & { name: string; email: string }) =>
      apiService.guestCreateTicket(data),
  });
}
