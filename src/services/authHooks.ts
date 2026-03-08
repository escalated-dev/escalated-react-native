import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'escalated_auth_token';

export interface AuthResult {
  token: string;
  user: { id: number; name: string; email: string };
}

export interface AuthHooks {
  onLogin(email: string, password: string): Promise<AuthResult>;
  onLogout(): Promise<void>;
  onTokenRefresh(): Promise<string | null>;
  onAuthError(statusCode: number, body: Record<string, unknown>): Promise<boolean>;
  onRegister(data: { name: string; email: string; password: string }): Promise<AuthResult>;
  getAuthHeaders(): Promise<Record<string, string>>;
}

export class DefaultAuthHooks implements AuthHooks {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = '') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async onLogin(email: string, password: string): Promise<AuthResult> {
    const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    const result: AuthResult = json.data ?? json;
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    return result;
  }

  async onLogout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  async onTokenRefresh(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;
      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return null;
      const json = await response.json();
      const newToken: string = json.token ?? json.data?.token;
      if (newToken) {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      }
      return newToken ?? null;
    } catch {
      return null;
    }
  }

  async onAuthError(statusCode: number, _body: Record<string, unknown>): Promise<boolean> {
    if (statusCode === 401) {
      const newToken = await this.onTokenRefresh();
      return newToken !== null;
    }
    return false;
  }

  async onRegister(data: { name: string; email: string; password: string }): Promise<AuthResult> {
    const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    const result: AuthResult = json.data ?? json;
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    return result;
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch {
      // ignore
    }
    return {};
  }
}

let authHooksInstance: AuthHooks = new DefaultAuthHooks();

export function getAuthHooks(): AuthHooks {
  return authHooksInstance;
}

export function setAuthHooks(hooks: AuthHooks): void {
  authHooksInstance = hooks;
}
