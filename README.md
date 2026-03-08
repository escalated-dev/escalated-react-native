# Escalated for React Native

A full-featured, embeddable support ticket UI for React Native apps. Drop it into any React Native project — get a complete customer-facing helpdesk with ticket management, knowledge base, guest access, and SLA tracking. Connects to the Escalated REST API.

**One provider, full support experience.** Wrap your app with `EscalatedProvider`, point it at your API, and every screen is ready — login, tickets, knowledge base, guest access. Customize colors, auth behavior, and locale with a single config object. TypeScript throughout.

## Features

- **Ticket management** — Create, view, filter, and reply to support tickets with file attachments
- **Knowledge base** — Searchable article list for self-service support
- **Guest tickets** — Anonymous ticket submission without requiring authentication
- **SLA tracking** — Real-time SLA countdown timers on ticket detail views
- **Satisfaction ratings** — Post-resolution CSAT ratings with star display
- **Auth hooks** — Override login, logout, register, and token retrieval to integrate with your existing auth
- **React Query** — Data fetching, caching, and synchronization out of the box
- **Navigation helpers** — Pre-built tab, auth, and guest navigation stacks for React Navigation
- **Dark mode** — Full dark and light theme support with `ThemeProvider` and `useTheme` hook
- **i18n** — Localized in 4 languages (English, Spanish, French, German)
- **TypeScript** — Full type definitions for every screen, component, hook, and config option
- **Configurable** — API base URL, auth hooks, primary color, border radius, dark mode, default locale

## Requirements

- React Native 0.72+
- React 18+
- Node.js 18+
- A running Escalated backend (Laravel, Rails, Django, AdonisJS, or WordPress)

## Quick Start

Install the package:

```bash
npm install @escalated-dev/escalated-react-native
```

Install peer dependencies:

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

Wrap your app with `EscalatedProvider`:

```tsx
import { EscalatedProvider, TicketListScreen } from '@escalated-dev/escalated-react-native';

<EscalatedProvider config={{ apiBaseUrl: 'https://yourapp.com/support/api/v1' }}>
  <NavigationContainer>
    {/* Wire screens into your navigation */}
  </NavigationContainer>
</EscalatedProvider>
```

That's it — your app now has a full support ticket UI.

## Configuration

The `EscalatedProvider` config prop accepts the following options:

```tsx
<EscalatedProvider
  config={{
    apiBaseUrl: 'https://yourapp.com/support/api/v1',
    authHooks: myAuthHooks,
    primaryColor: '#4F46E5',
    borderRadius: 12,
    darkMode: false,
    defaultLocale: 'en',
  }}
>
  {children}
</EscalatedProvider>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiBaseUrl` | `string` | required | Base URL for the Escalated REST API |
| `authHooks` | `EscalatedAuthHooks` | `undefined` | Custom auth hook overrides |
| `primaryColor` | `string` | `'#4F46E5'` | Primary action color for buttons and accents |
| `borderRadius` | `number` | `8` | Border radius for cards, inputs, and buttons |
| `darkMode` | `boolean` | `false` | Enable dark theme |
| `defaultLocale` | `string` | `'en'` | Default locale code (`en`, `es`, `fr`, `de`) |

## Available Screens

| Screen | Description |
|--------|-------------|
| `LoginScreen` | Email/password login form |
| `RegisterScreen` | New account registration |
| `TicketListScreen` | Paginated ticket list with status filters |
| `TicketCardScreen` | Individual ticket card view |
| `TicketFilterScreen` | Advanced ticket filter controls |
| `CreateTicketScreen` | New ticket form with file attachments |
| `TicketDetailScreen` | Full ticket thread with replies and metadata |
| `KBListScreen` | Knowledge base article listing |
| `KBArticleScreen` | Single article view |
| `GuestCreateScreen` | Anonymous ticket submission |
| `GuestTicketScreen` | Guest ticket view via token |
| `SettingsScreen` | User preferences and locale selection |

## Available Components

| Component | Description |
|-----------|-------------|
| `StatusBadge` | Ticket status indicator |
| `PriorityBadge` | Priority level indicator |
| `SlaTimer` | SLA countdown display |
| `AttachmentList` | File attachment display |
| `FilePicker` | File selection for attachments |
| `SatisfactionRating` | Star rating display and input |
| `ReplyThread` | Chronological message thread |
| `ReplyComposer` | Reply text input with attachments |
| `EmptyState` | Placeholder for empty lists |
| `LoadingSkeleton` | Skeleton loading placeholder |

## Navigation Helpers

Escalated provides pre-built navigation stacks for React Navigation:

```tsx
import {
  createEscalatedTabs,
  createAuthStack,
  createGuestStack,
} from '@escalated-dev/escalated-react-native';

// Full tabbed experience (Tickets, Knowledge Base, Settings)
const EscalatedTabs = createEscalatedTabs();

// Auth screens only (Login, Register)
const AuthStack = createAuthStack();

// Guest screens only (GuestCreate, GuestTicket)
const GuestStack = createGuestStack();
```

Wire them into your existing navigation tree:

```tsx
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Support" component={EscalatedTabs} />
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="Guest" component={GuestStack} />
  </Stack.Navigator>
</NavigationContainer>
```

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

## Theme

Escalated includes a `ThemeProvider` and `useTheme` hook for dark/light mode support:

```tsx
import { useTheme } from '@escalated-dev/escalated-react-native';

function MyComponent() {
  const { colors, darkMode, toggleDarkMode } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Themed content</Text>
    </View>
  );
}
```

Theme values (primary color, border radius, dark mode) are set via the `EscalatedProvider` config and accessible anywhere via `useTheme`.

## Internationalization

Escalated ships with translations for four languages:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |

Set the default locale via `config.defaultLocale` or let users switch in the Settings screen.

## Peer Dependencies

| Package | Purpose |
|---------|---------|
| `react` | React core |
| `react-native` | React Native core |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator |
| `@react-navigation/bottom-tabs` | Tab navigator |
| `react-native-screens` | Native screen primitives |
| `react-native-safe-area-context` | Safe area insets |

## Also Available For

| Framework | Package | Repository |
|-----------|---------|------------|
| Laravel | `escalated-dev/escalated-laravel` | [GitHub](https://github.com/escalated-dev/escalated-laravel) |
| Ruby on Rails | `escalated` (gem) | [GitHub](https://github.com/escalated-dev/escalated-rails) |
| Django | `escalated-django` | [GitHub](https://github.com/escalated-dev/escalated-django) |
| AdonisJS | `@escalated-dev/escalated-adonis` | [GitHub](https://github.com/escalated-dev/escalated-adonis) |
| WordPress | `escalated-wordpress` | [GitHub](https://github.com/escalated-dev/escalated-wordpress) |
| Vue UI | `@escalated-dev/escalated` | [GitHub](https://github.com/escalated-dev/escalated) |
| Flutter | `escalated` (Flutter) | [GitHub](https://github.com/escalated-dev/escalated-flutter) |
| React Native | `@escalated-dev/escalated-react-native` | [GitHub](https://github.com/escalated-dev/escalated-react-native) |

Same architecture, same REST API, same support experience — for every major framework.

## License

MIT
