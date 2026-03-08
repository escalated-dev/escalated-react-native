import apiClient from './apiClient';
import { PaginatedResponse, AuthResult, Department } from '../types/common';
import { Ticket, TicketSummary, CreateTicketRequest, TicketFilters } from '../types/ticket';
import { Reply, ReplyRequest } from '../types/reply';
import { Article, ArticleSummary, ArticleCategory, ArticleFilters } from '../types/article';

function buildFormData(
  data: Record<string, unknown>,
  attachments?: { uri: string; name: string; type: string }[]
): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (attachments?.length) {
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as unknown as Blob);
    });
  }
  return formData;
}

// Auth
export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await apiClient.post<AuthResult>('/auth/login', { email, password });
  return response.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResult> {
  const response = await apiClient.post<AuthResult>('/auth/register', {
    name,
    email,
    password,
    password_confirmation,
  });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<{ data: { id: number; name: string; email: string } }> {
  const response = await apiClient.get('/auth/user');
  return response.data;
}

// Tickets
export async function getTickets(
  filters: TicketFilters = {}
): Promise<PaginatedResponse<TicketSummary>> {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.page) params.page = filters.page;
  const response = await apiClient.get<PaginatedResponse<TicketSummary>>('/tickets', { params });
  return response.data;
}

export async function getTicket(id: number): Promise<{ data: Ticket }> {
  const response = await apiClient.get<{ data: Ticket }>(`/tickets/${id}`);
  return response.data;
}

export async function createTicket(request: CreateTicketRequest): Promise<{ data: Ticket }> {
  const formData = buildFormData(
    {
      subject: request.subject,
      description: request.description,
      priority: request.priority,
      department_id: request.department_id,
    },
    request.attachments
  );
  const response = await apiClient.post<{ data: Ticket }>('/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function replyToTicket(
  ticketId: number,
  request: ReplyRequest
): Promise<{ data: Reply }> {
  const formData = buildFormData({ body: request.body }, request.attachments);
  const response = await apiClient.post<{ data: Reply }>(
    `/tickets/${ticketId}/replies`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export async function closeTicket(ticketId: number): Promise<{ data: Ticket }> {
  const response = await apiClient.post<{ data: Ticket }>(`/tickets/${ticketId}/close`);
  return response.data;
}

export async function reopenTicket(ticketId: number): Promise<{ data: Ticket }> {
  const response = await apiClient.post<{ data: Ticket }>(`/tickets/${ticketId}/reopen`);
  return response.data;
}

export async function rateTicket(
  ticketId: number,
  rating: number,
  comment?: string
): Promise<void> {
  await apiClient.post(`/tickets/${ticketId}/rate`, { rating, comment });
}

// Departments
export async function getDepartments(): Promise<{ data: Department[] }> {
  const response = await apiClient.get<{ data: Department[] }>('/departments');
  return response.data;
}

// Knowledge Base
export async function getArticles(
  filters: ArticleFilters = {}
): Promise<PaginatedResponse<ArticleSummary>> {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.page) params.page = filters.page;
  const response = await apiClient.get<PaginatedResponse<ArticleSummary>>('/kb/articles', {
    params,
  });
  return response.data;
}

export async function getArticle(id: number): Promise<{ data: Article }> {
  const response = await apiClient.get<{ data: Article }>(`/kb/articles/${id}`);
  return response.data;
}

export async function submitArticleFeedback(
  articleId: number,
  helpful: boolean
): Promise<void> {
  await apiClient.post(`/kb/articles/${articleId}/feedback`, { helpful });
}

export async function getCategories(): Promise<{ data: ArticleCategory[] }> {
  const response = await apiClient.get<{ data: ArticleCategory[] }>('/kb/categories');
  return response.data;
}

// Guest
export async function guestCreateTicket(
  data: CreateTicketRequest & { name: string; email: string }
): Promise<{ data: Ticket }> {
  const formData = buildFormData(
    {
      name: data.name,
      email: data.email,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      department_id: data.department_id,
    },
    data.attachments
  );
  const response = await apiClient.post<{ data: Ticket }>('/guest/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function guestGetTicket(
  reference: string,
  email: string
): Promise<{ data: Ticket }> {
  const response = await apiClient.get<{ data: Ticket }>('/guest/tickets/lookup', {
    params: { reference, email },
  });
  return response.data;
}

export async function guestReplyToTicket(
  reference: string,
  email: string,
  request: ReplyRequest
): Promise<{ data: Reply }> {
  const formData = buildFormData(
    { body: request.body, email },
    request.attachments
  );
  const response = await apiClient.post<{ data: Reply }>(
    `/guest/tickets/${reference}/replies`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}
