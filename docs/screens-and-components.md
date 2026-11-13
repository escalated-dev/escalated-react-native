# Screens, components and navigation

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
