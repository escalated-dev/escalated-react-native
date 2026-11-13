# Installation and configuration

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
