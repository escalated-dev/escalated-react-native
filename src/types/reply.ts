export interface Attachment {
  id: number;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
}

export interface Reply {
  id: number;
  body: string;
  is_internal_note: boolean;
  is_pinned: boolean;
  author: {
    id: number;
    name: string;
    email: string;
  };
  attachments: Attachment[];
  created_at: string;
}

export interface ReplyRequest {
  body: string;
  attachments?: {
    uri: string;
    name: string;
    type: string;
  }[];
}
