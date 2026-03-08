export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type StatusValue =
  | 'open'
  | 'in_progress'
  | 'waiting_on_customer'
  | 'waiting_on_agent'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened';

export type PriorityValue = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

export interface LabeledValue<T extends string = string> {
  value: T;
  label: string;
}
