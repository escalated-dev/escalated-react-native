# Theming

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
