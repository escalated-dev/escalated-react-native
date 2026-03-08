import { User, Department, Tag, LabeledValue, StatusValue, PriorityValue } from './common';
import { Reply } from './reply';

export interface TicketSummary {
  id: number;
  reference: string;
  subject: string;
  status: StatusValue;
  status_label: string;
  priority: PriorityValue;
  priority_label: string;
  requester: {
    name: string;
    email: string;
  };
  assignee: {
    id: number;
    name: string;
  } | null;
  department: Department | null;
  sla_breached: boolean;
  last_reply_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketSla {
  first_response_due_at: string | null;
  first_response_at: string | null;
  first_response_breached: boolean;
  resolution_due_at: string | null;
  resolution_breached: boolean;
}

export interface Ticket {
  id: number;
  reference: string;
  subject: string;
  description: string;
  status: LabeledValue<StatusValue>;
  priority: LabeledValue<PriorityValue>;
  channel: string;
  metadata: Record<string, unknown>;
  requester: User;
  assignee: User | null;
  department: Department | null;
  tags: Tag[];
  replies: Reply[];
  activities: unknown[];
  sla: TicketSla | null;
  is_following: boolean;
  followers_count: number;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority: PriorityValue;
  department_id?: number;
  attachments?: {
    uri: string;
    name: string;
    type: string;
  }[];
}

export interface TicketFilters {
  search?: string;
  status?: StatusValue;
  priority?: PriorityValue;
  page?: number;
}
