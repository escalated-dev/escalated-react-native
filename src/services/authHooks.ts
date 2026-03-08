import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'escalated_auth_token';

export interface AuthHooks {
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
}

export class DefaultAuthHooks implements AuthHooks {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

let authHooksInstance: AuthHooks = new DefaultAuthHooks();

export function getAuthHooks(): AuthHooks {
  return authHooksInstance;
}

export function setAuthHooks(hooks: AuthHooks): void {
  authHooksInstance = hooks;
}
