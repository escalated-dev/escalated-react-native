// Configuration
export { EscalatedProvider, type EscalatedConfig } from './EscalatedProvider';
export { AuthProvider } from './AuthProvider';

// Theme
export { ThemeProvider } from './theme/ThemeProvider';
export { useTheme, type Theme, type ThemeContextType } from './theme/useTheme';
export { colors, getThemeColors, type ThemeMode, type ThemeColors } from './theme/colors';
export { spacing, borderRadius, fontSize, fontWeight } from './theme/spacing';

// Services
export {
  type AuthHooks,
  DefaultAuthHooks,
  getAuthHooks,
  setAuthHooks,
} from './services/authHooks';
export { default as apiClient, setBaseURL } from './services/apiClient';
export * as ApiService from './services/apiService';

// Types
export type {
  TicketSummary,
  Ticket,
  TicketSla,
  CreateTicketRequest,
  TicketFilters,
} from './types/ticket';
export type {
  Reply,
  ReplyRequest,
  Attachment,
} from './types/reply';
export type {
  Article,
  ArticleSummary,
  ArticleCategory,
  ArticleFilters,
} from './types/article';
export type {
  User,
  Department,
  Tag,
  PaginatedResponse,
  AuthResult,
  ApiError,
  StatusValue,
  PriorityValue,
  LabeledValue,
} from './types/common';

// Hooks
export { useTickets, useTicket } from './hooks/useTickets';
export { useCreateTicket, useGuestCreateTicket } from './hooks/useCreateTicket';
export {
  useReplyTicket,
  useCloseTicket,
  useReopenTicket,
  useRateTicket,
} from './hooks/useReplyTicket';
export { useArticles, useArticle, useArticleFeedback, useCategories } from './hooks/useArticles';
export {
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useAuthContext,
  AuthContext,
  type AuthContextType,
} from './hooks/useAuth';
export { useDepartments } from './hooks/useDepartments';

// Components
export { StatusBadge } from './components/StatusBadge';
export { PriorityBadge } from './components/PriorityBadge';
export { SlaTimer } from './components/SlaTimer';
export { AttachmentList } from './components/AttachmentList';
export { FilePicker, type PickedFile } from './components/FilePicker';
export { SatisfactionRating } from './components/SatisfactionRating';
export { ReplyThread } from './components/ReplyThread';
export { ReplyComposer } from './components/ReplyComposer';
export { EmptyState } from './components/EmptyState';
export { LoadingSkeleton } from './components/LoadingSkeleton';

// Screens
export { LoginScreen } from './screens/auth/LoginScreen';
export { RegisterScreen } from './screens/auth/RegisterScreen';
export { TicketListScreen } from './screens/tickets/TicketListScreen';
export { TicketDetailScreen } from './screens/tickets/TicketDetailScreen';
export { TicketCard } from './screens/tickets/TicketCard';
export { TicketFilterSheet } from './screens/tickets/TicketFilterSheet';
export { CreateTicketScreen } from './screens/tickets/CreateTicketScreen';
export { KBListScreen } from './screens/kb/KBListScreen';
export { KBArticleScreen } from './screens/kb/KBArticleScreen';
export { GuestCreateScreen } from './screens/guest/GuestCreateScreen';
export { GuestTicketScreen } from './screens/guest/GuestTicketScreen';
export { SettingsScreen } from './screens/settings/SettingsScreen';

// Navigation helpers
export {
  createEscalatedTabs,
  createAuthStack,
  createGuestStack,
  type AuthStackParamList,
  type TicketStackParamList,
  type KBStackParamList,
  type GuestStackParamList,
  type MainTabsParamList,
} from './navigation/createEscalatedNavigator';

// Legacy navigation (for backward compat)
export { AppNavigator } from './navigation/AppNavigator';
export { AuthNavigator } from './navigation/AuthNavigator';
export { MainTabs } from './navigation/MainTabs';
export { TicketStack } from './navigation/TicketStack';
export { KBStack } from './navigation/KBStack';

// i18n
export {
  I18nProvider,
  useI18n,
  I18nContext,
  localeLabels,
  type Locale,
  type I18nContextType,
  type Translations,
} from './i18n';
export type { TranslationKeys } from './i18n/en';
