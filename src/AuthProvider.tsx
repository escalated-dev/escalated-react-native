import React, { useMemo } from 'react';
import {
  AuthContext,
  AuthContextType,
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
} from './hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logout = useLogout();

  const isAuthenticated = !!user;
  const isLoading = isUserLoading;

  const value: AuthContextType = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated,
      isLoading,
      loginMutation,
      registerMutation,
      logout,
    }),
    [user, isAuthenticated, isLoading, loginMutation, registerMutation, logout]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}
