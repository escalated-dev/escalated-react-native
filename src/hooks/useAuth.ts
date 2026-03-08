import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiService from '../services/apiService';
import { getAuthHooks } from '../services/authHooks';
import { User } from '../types/common';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginMutation: ReturnType<typeof useLoginMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
  logout: () => Promise<void>;
}

function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
    onSuccess: async (data) => {
      const hooks = getAuthHooks();
      await hooks.setToken(data.token);
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      password_confirmation,
    }: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => apiService.register(name, email, password, password_confirmation),
    onSuccess: async (data) => {
      const hooks = getAuthHooks();
      await hooks.setToken(data.token);
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useLogin() {
  return useLoginMutation();
}

export function useRegister() {
  return useRegisterMutation();
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    try {
      await apiService.logout();
    } catch {
      // Ignore logout errors
    }
    const hooks = getAuthHooks();
    await hooks.removeToken();
    queryClient.clear();
  }, [queryClient]);
}

export function useCurrentUser() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const hooks = getAuthHooks();
      const token = await hooks.getToken();
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const result = await apiService.getCurrentUser();
      return result.data;
    },
    enabled: hasToken === true,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
