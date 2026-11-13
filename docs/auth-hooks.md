# Auth hooks

## Auth Hooks

Auth hooks let you override default authentication behavior to integrate with your app's existing auth system:

```tsx
<EscalatedProvider
  config={{
    apiBaseUrl: 'https://yourapp.com/support/api/v1',
    authHooks: {
      onLogin: async (email, password) => {
        // Your custom login logic
        return yourAuthToken;
      },
      onLogout: async () => {
        // Your custom logout logic
      },
      onRegister: async (name, email, password) => {
        // Your custom registration logic
        return yourAuthToken;
      },
      getToken: async () => {
        // Return the current auth token
        return await AsyncStorage.getItem('token');
      },
    },
  }}
>
  {children}
</EscalatedProvider>
```

When no auth hooks are provided, Escalated uses its built-in Axios HTTP client for token management.
